==Steps:==

-   npm i -G typescript ts-node
-   npm i discord.js @types/node better-sqlite3 @types/better-sqlite3
-   Create webhook, retrieve it's ID and token
-   Copy private-config.json.copyme to private-config.json, fill it in

===SQL===

-   Run sqlite3
-   CREATE TABLE compliment1 ( value TEXT );
-   CREATE TABLE compliment2 ( value TEXT );
-   CREATE TABLE compliment3 ( value TEXT );
-   CREATE TABLE insult1 ( value TEXT );
-   CREATE TABLE insult2 ( value TEXT );
-   CREATE TABLE insult3 ( value TEXT );

==To: other folks working on this:==

-   Webhooks seem to be the only way to spoof / regex, but the webhook is channel-specific. Right now there's just one for #general, but we may want others. To support spoofing in more channels than just #general, we'd need a webhook in each and a mapping of channels to tokens
