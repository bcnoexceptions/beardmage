import * as Discord from "discord.js";
import { getWebhookForChannel } from "./database";

export interface IWebhook {
    ID: string;
    token: string;
}

export function sendMessageToChannel(
    channel: string,
    message: string,
    username: string,
    userAvatar?: string
): boolean {
    const connInfo = getWebhookForChannel(channel);
    if (!connInfo) {
        return false;
    }
    sendMessageToHook(connInfo, message, username, userAvatar);
    return true;
}

export function sendMessageToHook(
    connInfo: IWebhook,
    message: string,
    username: string,
    userAvatar?: string
) {
    const webh = new Discord.WebhookClient(connInfo.ID, connInfo.token);

    webh.send(message, { username: username, avatarURL: userAvatar });
}

export async function findOrCreateWebhookForChannel(
    channel: Discord.TextChannel
): Promise<Discord.Webhook> {
    const webhook = await findAnyWebhooksOnChannel(channel);
    if (webhook) {
        return webhook;
    }

    return createWebhookForChannel(channel);
}

export async function findAnyWebhooksOnChannel(
    channel: Discord.TextChannel
): Promise<Discord.Webhook | null> {
    const webhookColl = await channel.fetchWebhooks();
    const webhooks = webhookColl.array();

    if (webhooks.length > 0) {
        return webhooks[0];
    }
    return null;
}

export async function createWebhookForChannel(
    channel: Discord.TextChannel
): Promise<Discord.Webhook> {
    console.log("creating new webhook for " + channel.name);
    return channel.createWebhook("_");
}
