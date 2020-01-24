import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
	randChat(message, "N", "O", "O", "", "!", true);
}

process.help = "!vader is sad";
