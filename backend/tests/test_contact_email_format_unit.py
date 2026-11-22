"""Regression tests for contact email plain-text formatting."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("MONGO_URL", "mongodb://127.0.0.1:27017")
os.environ.setdefault("DB_NAME", "id9_unit_test")
os.environ.setdefault("JWT_SECRET", "unit-test-only-not-a-production-secret")

import server


def test_contact_email_text_uses_real_line_breaks():
    fields = [("Nom", "Wensly"), ("Message", "Premier\nDeuxième ligne")]

    result = server.format_contact_email_text(fields)

    assert result == "Nom: Wensly\nMessage: Premier\nDeuxième ligne"
    assert "\\n" not in result
