import * as Discord from "discord.js";
import { getAllCommands } from "../knownCommands";

export default function process(message: Discord.Message): void {
    const commands = getAllCommands();
    const texts: string[] = [];

    for (const cmd of commands) {
        if (cmd.help) {
            texts.push(cmd.help);
        }
    }

    message.author.send(texts.join("\n"));
}

process.help = "!help";
