import * as Discord from "discord.js";
import { notifyAuthorOfFailure } from "./util";
import * as knownCommands from "./knownCommands";
import { getUserName } from "./knownUsers";
import { tryToPostInSameChannel, getNonSpecialChannels } from "./channels";
import {
    addMessageAuthorToChannel,
    removeMessageAuthorFromChannel,
} from "./userPermissions";

/** Assumes this message starts with ! */
export async function handleCommand(message: Discord.Message) {
    if (message.content.startsWith("!s/")) {
        await handleRegex(message);
    } else if (message.content.startsWith("!+")) {
        addChannel(message);
    } else if (message.content.startsWith("!-")) {
        removeChannel(message);
    } else {
        let commandName = message.content.split(/\s+/)[0];
        commandName = commandName.substring(1); // remove the !

        const command = knownCommands.getCommand(commandName);
        if (command) {
            try {
                await command(message);
            } catch (e) {
                if (e instanceof Error) {
                    notifyAuthorOfFailure(
                        message,
                        `command failed: ${e.toString()}`
                    );
                }
            }
        } else {
            // don't complain, it could be another bot's territory
            //notifyAuthorOfFailure(message, `unknown command ${commandName}, try !help`);
        }
    }

    message.delete(); // remove the command from the chat
}

export async function handleRegex(message: Discord.Message) {
    // blech, there is surely a better way to handle escaped backslashes, but I'm being lazy
    const TEMP_REPLACE = "%%==%%";
    let wholePattern = message.content.substring(3); // remove the '!s/'
    wholePattern.replace("\\\\", TEMP_REPLACE);

    const pieces = wholePattern.split(/(?<!\\)\//); // split by slashes NOT preceded by backslashes

    if (pieces.length < 3) {
        notifyAuthorOfFailure(
            message,
            `bad regex specification ${message.content}`
        );
        return; // TODO consider shaming him in the channel
    }

    const subTarget = await getMessageToRegex(message);
    if (!subTarget) {
        notifyAuthorOfFailure(message, `no messages found from you`);
        return; // no message found to replace
    }

    const regex = new RegExp(pieces[0], pieces[2]);
    const newText = subTarget.content.replace(regex, pieces[1]);

    if (message.member && 
        tryToPostInSameChannel(
            message,
            newText,
            getUserName(message.member),
            "Can't regex on this channel"
        )
    ) {
        subTarget.delete();
    }
}

function addChannel(message: Discord.Message) {
    const channel = getChannelFromMessage(message);
    if (!channel) {
        return;
    }
    addMessageAuthorToChannel(message, channel, true);
}

function removeChannel(message: Discord.Message) {
    const channel = getChannelFromMessage(message);
    if (!channel) {
        return;
    }
    removeMessageAuthorFromChannel(message, channel, true);
}

async function getMessageToRegex(
    regexMessage: Discord.Message
): Promise<Discord.Message | null> {
    const last100MessagesColl = await regexMessage.channel.messages.fetch({
        limit: 100,
    });

    const last100Messages = [...last100MessagesColl.values()];
    last100Messages.sort((m1, m2) => m1.createdTimestamp - m2.createdTimestamp);

    let found = 0;
    for (let i = last100Messages.length - 1; i >= 0; i--) {
        if (
            last100Messages[i].author.username === regexMessage.author.username
        ) {
            found++;
        }

        // skip the first one: that will be the regex itself
        if (found === 2) {
            return last100Messages[i];
        }
    }

    return null;
}

function getChannelFromMessage(message: Discord.Message): string | null {
    const channel = message.content.substring("!+".length);

    const availableChannels = getNonSpecialChannels();
    if (availableChannels.findIndex((avail) => avail.name === channel) >= 0) {
        return channel;
    }

    return null; // unknown channel
}
