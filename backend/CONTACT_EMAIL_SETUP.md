# ID9 contact brief email delivery

The public `POST /api/contact` endpoint validates and rate-limits each brief, stores it in MongoDB before attempting email delivery, then sends the complete brief through Resend to `CONTACT_TO_EMAIL` (defaults to `contact.id9agency@gmail.com`). The visitor's email is set as `reply_to`, so the ID9 team can reply directly.

## Required backend environment variables

- `MONGO_URL`: MongoDB Atlas connection string.
- `DB_NAME`: database name.
- `JWT_SECRET`: long random secret used by admin authentication.
- `RESEND_API_KEY`: private Resend API key; never expose it in frontend variables.
- `CONTACT_TO_EMAIL`: destination inbox; use `contact.id9agency@gmail.com`.
- `CONTACT_FROM_EMAIL`: sender identity using a domain verified in Resend.
- `CORS_ORIGINS`: comma-separated production frontend origins.

## Delivery behavior

- The contact document is persisted first and carries an `email_status` field.
- On provider acceptance, status becomes `sent` and the API returns HTTP 201.
- If provider configuration or delivery fails after persistence, status becomes `failed`; the API returns HTTP 202 with the saved contact record. The brief remains available in the authenticated admin contacts endpoint.
- HTTP 202 is intentional: the visitor's brief is saved, so the UI must not invite an automatic resubmission that could create duplicates. The UI explains that the email notification failed and offers WhatsApp as an immediate follow-up channel.
- The Resend call runs in a worker thread with a 15-second timeout. Provider credentials and sender identity remain server-side; raw provider errors and full brief content are not returned to the visitor.
- Provider credentials remain exclusively in the backend environment.

## Staging verification before any production change

1. Configure the variables only in the isolated Render Staging service, using an Atlas staging database and a new staging JWT secret.
2. Confirm the sender domain is verified in Resend and the staging sender/destination are explicitly approved.
3. Deploy to Staging only after CI passes; verify `/health/live` and `/health/ready`.
4. Submit controlled test briefs against the staging API and verify persistence, rate limiting, field normalization, and `email_status` transitions.
5. Verify provider acceptance and actual mailbox receipt; check reply-to and the admin contact record.
6. Exercise provider failure with a mocked test, not by disabling production credentials. Confirm HTTP 202, persisted brief, and clear frontend warning.
7. Check logs using contact references only. Never log API keys or full brief content.

Production verification requires a separate approval, a reviewed rollback plan, and a post-deployment smoke test. This document does not authorize a production deployment.
