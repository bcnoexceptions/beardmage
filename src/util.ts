import * as Discord from "discord.js";
import * as privateConfig from "./config/private-config.json";

export interface IStringMap<T> {
    [index: string]: T;
}

export function sendMessageAs(
    username: string,
    userAvatar: string,
    message: string
) {
    const webh = new Discord.WebhookClient(
        privateConfig.webhookID,
        privateConfig.webhookToken
    );

    webh.send(message, { username: username, avatarURL: userAvatar });
}

export function notifyAuthorOfFailure(
    originalMessage: Discord.Message,
    whyItFailed: string
) {
    originalMessage.author.send(whyItFailed);
}
