import * as Discord from "discord.js";
import { unthemePerson } from "../database";

export default function process(message: Discord.Message): void {
	unthemePerson(message.author.username);

	message.author.send("No emojis for you!");
}

process.help = "remove sweet emojis from your messages";
process.disabled = true;
