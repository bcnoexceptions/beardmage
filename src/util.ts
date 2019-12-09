import * as Discord from "discord.js";

export interface IStringMap<T> {
    [index: string]: T;
}

export function notifyAuthorOfFailure(
    originalMessage: Discord.Message,
    whyItFailed: string
) {
    originalMessage.author.send(whyItFailed);
}
