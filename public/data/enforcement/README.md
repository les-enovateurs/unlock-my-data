# GDPR enforcement data

## Source and licence

Source: **enforcementtracker.com, provided by CMS**
Licence: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

The files in this directory are licensed under CC BY-NC-SA 4.0, **not** under the
MIT licence that covers the rest of this repository. Any redistribution of them,
or of a work derived from them, must keep the same licence and the credit above.

## Changes made to the source data

- Fields extracted from the published HTML pages of enforcementtracker.com.
- Amounts normalised to whole euros; a missing amount is `null`, distinct from `0`.
- Dates normalised: the source mixes full dates, year-month, year-only and the
  literal string `Unknown`. Whatever precision is genuinely present is kept, and
  anything unusable becomes `null` — no day is ever invented.
- Decisions issued by the French authority (CNIL) removed, to avoid duplicating
  the records already collected directly from the CNIL.
- Records linked to Unlock My Data service slugs in `index-by-slug.json`.

## Files

| File | Contents |
|------|----------|
| `fines.json` | Normalised fine records |
| `index-by-slug.json` | Service slug to ETid mapping, with the match reason |
| `review-queue.json` | Partial matches awaiting human confirmation, never published |

Regenerate with `npm run update-enforcement-tracker`.

Retrieved: see the `retrieved_at` field on each record.
