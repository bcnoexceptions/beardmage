import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
	randChat(message, "ke", "ke", "ke");
}

process.help = "!zerg does a zerg thing?";
