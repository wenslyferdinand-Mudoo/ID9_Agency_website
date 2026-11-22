import os
import sys
from pathlib import Path

# Keep model tests independent from a live database; server.py only constructs
# the Motor client at import time and does not connect until startup.
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_test")
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from pydantic import ValidationError

from server import ContactCreate


def test_contact_create_trims_text_fields():
    contact = ContactCreate(
        name="  Wensly Ferdinand  ",
        email="contact@example.com",
        whatsapp="  +509 3163 4848  ",
        message="  I need a brand identity.  ",
    )

    assert contact.name == "Wensly Ferdinand"
    assert contact.whatsapp == "+509 3163 4848"
    assert contact.message == "I need a brand identity."


@pytest.mark.parametrize(
    "payload",
    [
        {"name": "A", "email": "contact@example.com", "message": "Hello"},
        {"name": "Valid Name", "email": "not-an-email", "message": "Hello"},
        {"name": "Valid Name", "email": "contact@example.com", "message": "Hi"},
        {
            "name": "N" * 121,
            "email": "contact@example.com",
            "message": "A sufficiently detailed project brief.",
        },
        {
            "name": "Valid Name",
            "email": "contact@example.com",
            "message": "M" * 5001,
        },
    ],
)
def test_contact_create_rejects_invalid_or_oversized_fields(payload):
    with pytest.raises(ValidationError):
        ContactCreate(**payload)


def test_contact_create_keeps_optional_fields_optional():
    contact = ContactCreate(
        name="Valid Name",
        email="contact@example.com",
        message="A sufficiently detailed project brief.",
    )

    assert contact.whatsapp is None
    assert contact.budget is None
    assert contact.service is None
    assert contact.deadline is None
