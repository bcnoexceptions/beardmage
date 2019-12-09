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
    userAvatar: string
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
    userAvatar: string
) {
    const webh = new Discord.WebhookClient(connInfo.ID, connInfo.token);

    webh.send(message, { username: username, avatarURL: userAvatar });
}
