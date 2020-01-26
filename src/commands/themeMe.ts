import * as Discord from "discord.js";
import { themePerson } from "../database";

export default function process(message: Discord.Message): void {
	themePerson(message.author.username);

	message.author.send("Sweet emojis headed your way!");
}

process.help = "put sweet emojis in your messages";
process.disabled = true;
