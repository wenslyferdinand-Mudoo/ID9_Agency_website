"""Opt-in MongoDB Atlas staging integration tests.

Set ID9_ATLAS_STAGING_URI and ID9_ATLAS_STAGING_DB explicitly.
Only databases prefixed with id9_staging_test_ are accepted. Every test
uses unique document identifiers and cleans up its own documents in finally;
no database or collection is dropped.
"""
import asyncio
import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

ATLAS_URI = os.environ.get("ID9_ATLAS_STAGING_URI", "").strip()
ATLAS_DB_NAME = os.environ.get("ID9_ATLAS_STAGING_DB", "").strip()

if not ATLAS_URI or not ATLAS_DB_NAME:
    pytest.skip(
        "Atlas staging not configured: set ID9_ATLAS_STAGING_URI and ID9_ATLAS_STAGING_DB.",
        allow_module_level=True,
    )
if not ATLAS_DB_NAME.startswith("id9_staging_test_"):
    raise RuntimeError(
        "Refusing Atlas integration tests: ID9_ATLAS_STAGING_DB must start with id9_staging_test_."
    )
if "localhost" in ATLAS_URI or "127.0.0.1" in ATLAS_URI:
    raise RuntimeError("This suite requires MongoDB Atlas staging, not localhost.")


@pytest.fixture(scope="module")
def atlas_config():
    return ATLAS_URI, ATLAS_DB_NAME


def test_atlas_indexes_unique_constraints_and_existing_data_preservation(atlas_config):
    suffix = uuid.uuid4().hex
    sentinel_id = f"id9-staging-sentinel-{suffix}"
    session_id = f"id9-staging-session-{suffix}"
    uri, db_name = atlas_config

    async def run():
        client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=8000)
        atlas_db = client[db_name]
        try:
            await atlas_db.command("ping")
            sentinel = {"_id": sentinel_id, "marker": "preserve-me"}
            await atlas_db.staging_sentinels.insert_one(sentinel)
            await atlas_db.auth_sessions.create_index("id", unique=True)
            await atlas_db.auth_sessions.create_index("expires_at", expireAfterSeconds=0)
            await atlas_db.rate_limits.create_index("expires_at", expireAfterSeconds=0)

            indexes = await atlas_db.auth_sessions.index_information()
            # Verify the intended key, not MongoDB's implicit unique _id index.
            assert indexes.get("id_1", {}).get("key") == [("id", 1)]
            assert indexes["id_1"].get("unique") is True
            assert indexes.get("expires_at_1", {}).get("key") == [("expires_at", 1)]
            assert indexes["expires_at_1"].get("expireAfterSeconds") == 0

            await atlas_db.auth_sessions.insert_one({"id": session_id, "marker": suffix})
            with pytest.raises(DuplicateKeyError):
                await atlas_db.auth_sessions.insert_one(
                    {"id": session_id, "marker": "duplicate"}
                )

            persisted = await atlas_db.staging_sentinels.find_one({"_id": sentinel_id})
            assert persisted == sentinel
        finally:
            await atlas_db.staging_sentinels.delete_one({"_id": sentinel_id})
            await atlas_db.auth_sessions.delete_one({"id": session_id})
            client.close()

    asyncio.run(run())


def test_atlas_atomic_rate_limit_counter_under_concurrency(atlas_config):
    counter_id = f"id9-staging-counter-{uuid.uuid4().hex}"
    uri, db_name = atlas_config

    async def run():
        client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=8000)
        atlas_db = client[db_name]
        try:
            await atlas_db.command("ping")

            async def increment():
                return await atlas_db.rate_limits.find_one_and_update(
                    {"_id": counter_id},
                    {
                        "$inc": {"count": 1},
                        "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
                    },
                    upsert=True,
                    return_document=ReturnDocument.AFTER,
                )

            await asyncio.gather(*(increment() for _ in range(40)))
            record = await atlas_db.rate_limits.find_one({"_id": counter_id})
            assert record is not None
            assert record["count"] == 40
        finally:
            await atlas_db.rate_limits.delete_one({"_id": counter_id})
            client.close()

    asyncio.run(run())


def test_atlas_refresh_rotation_is_single_use_under_concurrency(atlas_config):
    session_id = f"id9-staging-rotation-{uuid.uuid4().hex}"
    current_hash = uuid.uuid4().hex
    now = datetime.now(timezone.utc)
    uri, db_name = atlas_config

    async def run():
        client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=8000)
        atlas_db = client[db_name]
        try:
            await atlas_db.command("ping")
            await atlas_db.auth_sessions.insert_one(
                {
                    "id": session_id,
                    "user_id": "atlas-staging-test-user",
                    "refresh_jti_hash": current_hash,
                    "revoked": False,
                    "expires_at": now + timedelta(days=1),
                    "absolute_expires_at": now + timedelta(days=30),
                }
            )
            selector = {
                "id": session_id,
                "refresh_jti_hash": current_hash,
                "revoked": False,
                "expires_at": {"$gt": now},
                "absolute_expires_at": {"$gt": now},
            }

            async def rotate():
                return await atlas_db.auth_sessions.find_one_and_update(
                    selector,
                    {
                        "$set": {
                            "refresh_jti_hash": uuid.uuid4().hex,
                            "last_used_at": now,
                        }
                    },
                    return_document=ReturnDocument.AFTER,
                )

            outcomes = await asyncio.gather(rotate(), rotate())
            assert sum(item is not None for item in outcomes) == 1
        finally:
            await atlas_db.auth_sessions.delete_one({"id": session_id})
            client.close()

    asyncio.run(run())
