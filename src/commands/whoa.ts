import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
	randChat(message, "WH", "O", "A", " DUDE", "!", Math.random() < 0.5);
}

process.help = "!whoa does a random thing";
