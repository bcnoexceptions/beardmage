import * as Discord from "discord.js";
import { loadAllChannels } from "../database";

export default function process(message: Discord.Message): void {
    const texts: string[] = [];
    const channels = loadAllChannels();
    for (const channel of channels) {
        if (channel.name === "") {
            continue;
        }
        if (channel.name === "admin-chat") {
            continue;
        }
        if (channel.name === "xcoolevents") {
            continue;
        }
        if (channel.name === "suggestion-box") {
            continue;
        }
        if (channel.name === "command-list") {
            continue;
        }

        texts.push(`#!+${channel.name}`);
    }

    message.author.send(texts.join("\n"));
}

process.help =
    "list channels which can be added/removed with !+(channel) or !-(channel)";
