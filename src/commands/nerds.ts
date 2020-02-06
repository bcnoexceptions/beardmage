import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "N", "E", "RDS", "", "!", Math.random() < 0.5);
}

process.help = "accuse the chat of nerdiness";
