// TEMPLATE! Copy this and change the triggers / reactions

import * as Discord from "discord.js";
import { IBotTrigger } from "../contextualResponses";

export class ChatMageTemplate implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return message.content.indexOf("xyzzy") >= 0;
	}

	public react(message: Discord.Message): void {
		message.channel.send("Screw birds!");
	}
}
