import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
	randChat(message, "Y", "E", "AH", "", "!", true);
}

process.help = "!who is at the start of CSI Miami";
