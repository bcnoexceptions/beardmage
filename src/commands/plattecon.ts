import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
	randChat(message, "PLATTEC", "O", "N", "", "!", Math.random() < 0.5);
}

process.help = "!plattecon PLATTECOOOOOOOOOOOOOOOOON";
