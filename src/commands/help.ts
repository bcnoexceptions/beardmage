import * as Discord from "discord.js";
import { getAllCommands } from "../knownCommands";

export default function process(message: Discord.Message): void {
    const commands = getAllCommands();
    const texts: string[] = [];

    for (const cmd of commands) {
        if (cmd.help) {
            texts.push(`!${cmd.commandName}: ${cmd.help}`);
        }
    }

    //Chunk into multiple messages because we have a lot of commands and 2k characters is too many
    const chunkSize = 25;
    for (let chunk = 0; chunk*chunkSize < texts.length; ++chunk) {
        const chunkToSend = texts.slice(chunk*chunkSize,((chunk+1)*chunkSize));
        if (chunk>=1) console.log(chunk);
        message.author.send(chunkToSend.join("\n"));
    }
}

process.help = "invoke the spirit of the Beatles";
