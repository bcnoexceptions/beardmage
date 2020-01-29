# NEWS

-   2019-12-11: beardslave will now create new channels and webhooks for you!

# Deployment Steps

-   `npm update`
-   `npm i -G typescript ts-node`
-   `npm i discord.js @types/node better-sqlite3 @types/better-sqlite3`  (run in the beardslave directory, it needs package.json)
-   Create webhook, retrieve it's ID and token
-   Copy private-config.json.copyme to private-config.json, fill it in
-   Fill in the friend codes spreadsheet link

If you get errors relating to Python when trying to npm update and the like, run this:
npm --add-python-to-path='true' --debug install --global windows-build-tools


## SQL

-   From the data folder, run `bash load-public.sh`
-   Copy load-private.sh.copyme to load-private.sh
-   Fill in the webhooks
-   Run `bash load-private.sh`

# Creating new channels

**2019-12-15**: You don't need to issue the sqlite command yourself anymore; just run the shell script `./add-channel.sh <channel> <role>` to update SQL.

-   Add the channel to channels.sqlite:
-   `cd beardslave/data`
-   `sqlite3 channels.sqlite`
-   `insert into channels values('(channel name)', '(role to access it)', '', '');`
-   Restart beardslave (!restart)

# Enabling beardslave for new channels

**2019-12-11**: you can skip adding the webhook; beardslave will create one for you!

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
