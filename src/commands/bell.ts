import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
	randChat(message, "DING", "DING", "DING", "", "!", true, 11);
}

process.help = "!bell rings a bell";
