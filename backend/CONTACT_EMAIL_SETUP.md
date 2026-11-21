# ID9 contact brief email delivery

The public `POST /api/contact` endpoint stores every valid brief in MongoDB before attempting email delivery. It then sends the complete brief through Resend to `CONTACT_TO_EMAIL` (defaults to `contact.id9agency@gmail.com`). The visitor's email is set as `reply_to`, so the ID9 team can reply directly.

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
- On provider acceptance, status becomes `sent` and the API returns success.
- If provider configuration or delivery fails, status becomes `failed`; the API returns HTTP 503 with a message that the brief was saved but email delivery failed. The brief remains available in the authenticated admin contacts endpoint.
- Provider credentials remain exclusively in the backend environment.

## Production verification

1. Confirm the Render service has the required environment variables.
2. Confirm the sender domain is verified in Resend.
3. Deploy the backend and verify `GET /api/` returns `{"message":"ID9_AGENCY API","status":"ok"}`.
4. Submit a controlled test brief through the production contact form.
5. Verify the received message in `contact.id9agency@gmail.com`, check that reply-to is the visitor, and confirm the contact record is present in the admin inbox.
6. Check backend logs for the contact reference and delivery result. Do not log API keys or full brief content.
