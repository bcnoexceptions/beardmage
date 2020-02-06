import * as Discord from "discord.js";
import { IBotTrigger } from "../contextualResponses";

export class WhatIsIt implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return message.content.toLowerCase().indexOf("what is it") >= 0;
	}

	public react(message: Discord.Message): void {
		message.channel.send("IT'S JIZZ!");
	}
}
