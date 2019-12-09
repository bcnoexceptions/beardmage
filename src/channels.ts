import { getWebhookForChannel } from "./database";
import * as Discord from "discord.js";
import { sendMessageToChannel } from "./webhooks";
import { notifyAuthorOfFailure } from "./util";

export function canPostToChannel(channelName: string): boolean {
    return !!getWebhookForChannel(channelName);
}

/**
 * Try to post in the same channel as a source message
 *
 * @export
 * @param {Discord.Message} message the source message; it's channel and author are used
 * @param {string} text the text to post
 * @param {string} userName the person to spoof
 * @param {string} messageOnFailure what to message the user (if anything) on failure
 * @param {string} avatarURL the image to associated with the user
 * @returns {boolean} true on success
 */
export function tryToPostInSameChannel(
    message: Discord.Message,
    text: string,
    userName: string,
    messageOnFailure: string | null,
    avatarURL?: string
): boolean {
    const channel = (message.channel as Discord.TextChannel).name;
    if (!canPostToChannel(channel)) {
        if (messageOnFailure) {
            notifyAuthorOfFailure(message, messageOnFailure);
        }
        return false;
    }

    if (!avatarURL) {
        avatarURL = message.author.avatarURL;
    }
    sendMessageToChannel(channel, text, userName, avatarURL);
    return true;
}
