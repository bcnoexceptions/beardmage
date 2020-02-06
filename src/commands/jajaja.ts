import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "JA", "JA", "JA", "", "!", Math.random() < 0.5, 12);
}

process.help = "laughs";
