import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "G", "O", "LD", "", "!", Math.random() < 0.5);
}

process.help = "follow the golden rule";
