import { WhatIsIt } from "./triggers/whatisit";
import { ChatSlaveLunch } from "./triggers/lunch";
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

export class ChatSlave {
	private static instance: ChatSlave;
	private scenarios: IBotTrigger[];

	private constructor() {
		// ADD TO THIS ARRAY to add new features to chatslave auto responses

		this.scenarios = [
			new MGRImpossible(),
			new MGRReallyUnlikely(),
			new MGRPrettyUnlikely(),
			new MGROkay(),
			new MGRPrettyLikely(),
			new MGRReallyLikely(),
			new MGRCantMiss(),
			new ChatSlaveLunch(),
			new WhatIsIt(),
			new UrMom(),
		];
	}

	public static getInstance(): ChatSlave {
		if (!ChatSlave.instance) {
			ChatSlave.instance = new ChatSlave();
		}
		return ChatSlave.instance;
	}

	public processMessage(message: Discord.Message) {
		for (let handler of this.scenarios) {
			if (handler.doesMessageApply(message)) {
				handler.react(message);
			}
		}
	}
}
