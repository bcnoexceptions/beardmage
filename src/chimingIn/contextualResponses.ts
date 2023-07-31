//import { ChatMageHaiku } from "./triggers/haiku";
import { WhatIsIt } from "./triggers/whatisit";
import { ChatMageLunch } from "./triggers/lunch";
import {
	MGRImpossible,
	MGRReallyUnlikely,
	MGRPrettyUnlikely,
	MGROkay,
	MGRPrettyLikely,
	MGRReallyLikely,
	MGRCantMiss,
} from "./triggers/mgr";
import * as Discord from "discord.js";
import { UrMom } from "./triggers/urMom";

export interface IBotTrigger {
	doesMessageApply(message: Discord.Message): boolean;
	react(message: Discord.Message): void;
}

export class ChatMage {
	private static instance: ChatMage;
	private scenarios: IBotTrigger[];

	private constructor() {
		// ADD TO THIS ARRAY to add new features to ChatMage auto responses

		this.scenarios = [
			new MGRImpossible(),
			new MGRReallyUnlikely(),
			new MGRPrettyUnlikely(),
			new MGROkay(),
			new MGRPrettyLikely(),
			new MGRReallyLikely(),
			new MGRCantMiss(),
			new ChatMageLunch(),
			new WhatIsIt(),
			new UrMom(),
			//new ChatMageHaiku(),
		];
	}

	public static getInstance(): ChatMage {
		if (!ChatMage.instance) {
			ChatMage.instance = new ChatMage();
		}
		return ChatMage.instance;
	}

	public processMessage(message: Discord.Message) {
		for (let handler of this.scenarios) {
			if (handler.doesMessageApply(message)) {
				handler.react(message);
			}
		}
	}
}
