import * as Discord from "discord.js";
import { exec } from "child_process";
import { notifyAuthorOfFailure } from "../util";

export default function process(message: Discord.Message): void {
    exec("~bc/bin/magiccard 2> /dev/null", (errMessage, stdout, stderr) => {
        if (errMessage) {
            notifyAuthorOfFailure(
                message,
                `Could not run !magic: ${errMessage.message}`
            );
        } else {
            const prefix = `${message.author.username} casts a spell!\n`;
            message.channel.send(prefix + stdout);
        }
    });
}

process.help = "!magic";
