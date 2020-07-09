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
		if (message.content && message.content[0] === "!") {
			return; // bot command
		}

		const channelName = (message.channel as Discord.TextChannel).name;

		if (!this.lastSyllablesByChannel[channelName]) {
			this.lastSyllablesByChannel[channelName] = [];
		}
		const queue = this.lastSyllablesByChannel[channelName];

		let haikuFound = false;
		let lines = message.content.split(/[\r\n]+/g);

		for (const line of lines) {
			const syllableCount = syllable(line);
			if (syllableCount === 0) {
				continue;
			}
			if (this.pushOneMessage(queue, syllableCount)) {
				haikuFound = true;
			}
		}

		if (haikuFound) {
			message.channel.send("nice haiku!");
		}
	}

	/**
	 * Add one line to the queue. Returns true if a haiku was found
	 *
	 * @param {number[]} queue
	 * @param {number} syllables
	 * @returns {boolean} true if a haiku was found
	 */
	private pushOneMessage(queue: number[], syllables: number): boolean {
		queue.push(syllables);

		if (queue.length > 3) {
			queue.shift();
		}
		if (queue.length < 3) {
			return false;
		}

		if (queue[0] === 5 && queue[1] === 7 && queue[2] === 5) {
			return true;
		} else {
			return false;
		}
	}
}
