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

# Creating new channels

-   Add the channel to channels.sqlite:
-   `cd beardslave/data`
-   `sqlite3 channels.sqlite`
-   `insert into channels values('(channel name)', '(role to access it)', '', '');`
-   Restart beardslave (!restart)

# Enabling beardslave for new channels

-   Add the webhook to the channel
    -   Go to channel settings -> Webhooks
    -   Add webhook.
    -   Check the URL of the webhook. It will be http://https://discordapp.com/api/webhooks/{ID}/{token}
-   Add the channel's token & ID to channels.sqlite
    -   `cd beardslave/data`
    -   `sqlite3 channels.sqlite`
    -   `UPDATE channels SET webhookID='(ID)', webhookToken='(token)' WHERE channel='(channel name)'`
-   Add the channel to the array in public-config.json
    -   `cd beardslave/src/config`
    -   `vim public-config.json`
-   Restart beardslave (!restart)
