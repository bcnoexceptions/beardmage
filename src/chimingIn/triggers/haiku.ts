import * as Discord from "discord.js";
import { IBotTrigger } from "../contextualResponses";
import { IStringMap } from "./../../util";

import syllable = require("syllable");

// check for haikus, stored per channel
export class ChatSlaveHaiku implements IBotTrigger {
	private lastSyllablesByChannel: IStringMap<number[]>;

	public constructor() {
		this.lastSyllablesByChannel = {};
	}

	public doesMessageApply(message: Discord.Message): boolean {
		return true;
	}

	public react(message: Discord.Message): void {
		const syllableCount = syllable(message.content);
		if (syllableCount === 0) {
			return;
		}

		const channelName = (message.channel as Discord.TextChannel).name;
		if (!this.lastSyllablesByChannel[channelName]) {
			this.lastSyllablesByChannel[channelName] = [];
		}

		const queue = this.lastSyllablesByChannel[channelName];
		queue.push(syllableCount);

		if (queue.length > 3) {
			queue.shift();
		}
		if (queue.length < 3) {
			return;
		}

		if (queue[0] === 5 && queue[1] === 7 && queue[2] === 5) {
			message.channel.send("nice haiku!");
		}
	}
}
