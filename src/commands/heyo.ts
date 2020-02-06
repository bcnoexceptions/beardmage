import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "hey", "o", "");
}

process.help = "Snow - RHCP";
