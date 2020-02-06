import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "br", "a", "ins", "", "!", Math.random() < 0.5);
}

process.help = "channel your inner zombies";
