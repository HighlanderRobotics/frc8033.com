# Contact form deployment

The native Astro form posts to a separate Cloudflare Worker. Accepted messages are
emailed to `frc8033@piedmontmakers.org` via Resend with the visitor as Reply-To.
The site is still a static build. Until the two public build variables are set,
the contact page shows a direct email link and disables online submission.

## One-time setup

1. In the team's Cloudflare account, create a **Managed** Turnstile widget. Add
   `highlanderrobotics.github.io`, `www.frc8033.com`, and `frc8033.com` as hostnames
   if both the GitHub Pages preview and the custom domain will serve the Astro form.
   Keep the site key for the site build and the secret key for the Worker.
2. In the team's Resend account, add and verify the sending subdomain
   `forms.frc8033.com` using the DNS records Resend supplies. Create a sending-only
   API key scoped to that domain. If using another verified sending domain, change
   `RESEND_FROM` in the Worker configuration.
3. Sign in to the Cloudflare account with Wrangler and create the database. Copy its
   UUID into `database_id` in `workers/contact/wrangler.jsonc`. From the repository root:

   ```sh
   npx wrangler login
   npx wrangler d1 create highlander-contact
   npx wrangler d1 execute highlander-contact --remote --file workers/contact/schema.sql --config workers/contact/wrangler.jsonc
   npx wrangler deploy --config workers/contact/wrangler.jsonc
   npx wrangler secret put TURNSTILE_SECRET --config workers/contact/wrangler.jsonc
   npx wrangler secret put RESEND_API_KEY --config workers/contact/wrangler.jsonc
   ```

   The Worker rejects submissions until both secrets exist. Keep the Cloudflare
   account and its Workers AI usage on the Free plan to avoid compute charges.
4. Under the GitHub repository's **Settings → Secrets and variables → Actions →
   Variables**, set `PUBLIC_CONTACT_ENDPOINT` to the deployed Worker URL ending
   in `/contact`, and `PUBLIC_TURNSTILE_SITE_KEY` to the public Turnstile key. For
   local builds, supply the same public variables through the environment or an
   ignored `.env` file. Never put the secrets into the Astro build.
5. Deploy the Astro site. Submit a harmless test inquiry from the deployed contact
   page and confirm that it arrives in the team inbox and that Reply goes to the
   test address. Check that an invalid challenge is refused and a flagged inquiry
   appears in D1. Once the replacement is verified, close submissions in the old
   Google Form so its direct link stops collecting messages. Changes to the old
   Google Form require separate approval.

## Reviewing held messages

Open the private D1 console in the team's Cloudflare dashboard and run:

```sql
SELECT id, datetime(created_at / 1000, 'unixepoch') AS received_utc,
       name, email, message, reason
FROM contact_messages
WHERE status = 'held'
ORDER BY created_at DESC
LIMIT 50;
```

Ordinary inquiries go directly to the team inbox. The Worker checks flagged messages with Workers
AI, sending message text with the supplied name and email removed where they can
be matched. It can release a multiple-link inquiry marked legitimate. Strong
spam patterns and uncertain or unavailable AI verdicts remain held. Turnstile
failures and rate-limited requests never enter the queue.

To release a held message for delivery on the next five-minute run, replace the
placeholder below with its UUID. For a delivery-related hold, first check the
Resend dashboard for the original send before resetting its retry window.

```sql
UPDATE contact_messages
SET status = 'pending', next_attempt_at = 0, first_attempt_at = NULL
WHERE status = 'held' AND id = 'REPLACE_WITH_MESSAGE_ID';
```

To dismiss confirmed spam and clear its stored content:

```sql
UPDATE contact_messages
SET status = 'dismissed', name = '', email = '', message = ''
WHERE status = 'held' AND id = 'REPLACE_WITH_MESSAGE_ID';
```

Delivered message contents are removed from D1 after Resend accepts the send.
The Worker retains held messages for up to 30 days and checks recent fingerprints
for duplicates. AI errors or exhausted free quota leave flagged messages available
for manual review.
