# Steps

-   `npm update`
-   `npm i -G typescript ts-node`
-   `npm i discord.js @types/node better-sqlite3 @types/better-sqlite3`
-   Create webhook, retrieve it's ID and token
-   Copy private-config.json.copyme to private-config.json, fill it in

## SQL

-   From the data folder, run `bash load-public.sql'
-   Copy load-private.sql.copyme to load-private.sql
-   Fill in the webhooks

# To: other folks working on this:

-   Webhooks seem to be the only way to spoof / regex, but the webhook is channel-specific. Right now there's just one for #general, but we may want others. To support spoofing in more channels than just #general, we'd need a webhook in each and a mapping of channels to tokens
