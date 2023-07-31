import * as Discord from "discord.js";
import { ReactSparta } from './handlers/sparta';

export interface IReactTrigger {
	doesReactApply(reaction: Discord.MessageReaction | Discord.PartialMessageReaction): boolean;
	react(message: Discord.MessageReaction | Discord.PartialMessageReaction, user: Discord.PartialUser | Discord.User): void;
}

export class ReactHandler
{
	private static instance: ReactHandler;
	private scenarios: IReactTrigger[];

	private constructor() {
		// ADD TO THIS ARRAY to add new features to ChatMage auto responses

		this.scenarios = [
			new ReactSparta(),
		];
	}

	public static getInstance(): ReactHandler {
		if (!ReactHandler.instance) {
			ReactHandler.instance = new ReactHandler();
		}
		return ReactHandler.instance;
	}

	public async processReact(reaction: Discord.MessageReaction | Discord.PartialMessageReaction, user: Discord.PartialUser | Discord.User): Promise<void> {
		for (let handler of this.scenarios) {
			if (handler.doesReactApply(reaction)) {
				handler.react(reaction, user);
			}
		}
	}
}
