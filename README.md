# Steps

-   `npm update`
-   `npm i -G typescript ts-node`
-   `npm i discord.js @types/node better-sqlite3 @types/better-sqlite3`
-   Create webhook, retrieve it's ID and token
-   Copy private-config.json.copyme to private-config.json, fill it in

## SQL

-   From the data folder, run `bash load-public.sh`
-   Copy load-private.sh.copyme to load-private.sh
-   Fill in the webhooks
-   Run `bash load-private.sh`

# Optional

-   Mess with the "permittedChannels" array in messageHandler.ts to turn beardslave on/off for channels
