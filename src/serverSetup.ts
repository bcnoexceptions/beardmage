import * as Discord from "discord.js";
import { loadAllChannels, updateChannelRowWithWebhook } from "./database";
import { findOrCreateChannel } from "./channels";
import { findOrCreateWebhookForChannel } from "./webhooks";

export async function syncServer(server: Discord.Guild) {
    const desiredChannels = loadAllChannels();

    for (const oneChannel of desiredChannels) {
        if (!oneChannel.role) {
            continue; // signal that we shouldn't mess with this channel (there's no role for it)
        }

        const channel = await findOrCreateChannel(
            server,
            oneChannel.name,
            oneChannel.role
        );

        const webhook = await findOrCreateWebhookForChannel(channel);
        if (webhook.token === null) {
            throw new Error(`Webhook for channel ${oneChannel.name} has no token`);
        }
        if (oneChannel.webhookID !== webhook.id) {
            // record it in the database!
            updateChannelRowWithWebhook(
                oneChannel.name,
                webhook.id,
                webhook.token
            );
            console.log(
                `recording new webhook (${webhook.id}, ${webhook.token}) in the database`
            );
        }
    }
}
