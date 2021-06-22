/** THIS COMMAND DOES NOTHING! It's just a template! */

import * as Discord from "discord.js";
import { getMomString } from "../chimingIn/triggers/urMom";

export default async function process(message: Discord.Message): Promise<void> {
	const lastList = await message.channel.messages.fetch({ limit: 2 });
	const last = lastList.last();  // this list will have two elements: !urMom, and the message
	if (!last) { return; }

	const text = await getMomString(last.content);
	if (text) {
		message.channel.send("`[req]`" + text);
	}
}

process.help = "Indicates what you've been up to lately, maternally.";

