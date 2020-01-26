import * as Discord from "discord.js";
import { IBotTrigger } from "../contextualResponses";

export class MGRImpossible implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/impossible/i);
	}

	public react(message: Discord.Message): void {
		const dice: number[] = [];
		let success = true;
		for (let i = 0; i < 6; i++) {
			const die = roll();
			if (die !== 6) {
				success = false;
			}
			dice.push(die);
		}

		message.channel.send(formatResponse(dice, success));
	}
}

export class MGRCantMiss implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/can't miss/i);
	}

	public react(message: Discord.Message): void {
		const dice: number[] = [];
		let success = false;
		for (let i = 0; i < 6; i++) {
			const die = roll();
			if (die !== 1) {
				success = true;
			}
			dice.push(die);
		}

		message.channel.send(formatResponse(dice, success));
	}
}

export class MGRReallyUnlikely implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/really unlikely/i);
	}

	public react(message: Discord.Message): void {
		const die = roll();
		const success = die >= 6;

		message.channel.send(formatResponse([die], success));
	}
}

export class MGRPrettyUnlikely implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/pretty unlikely/i);
	}

	public react(message: Discord.Message): void {
		const die = roll();
		const success = die >= 5;

		message.channel.send(formatResponse([die], success));
	}
}

export class MGROkay implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/okay/i);
	}

	public react(message: Discord.Message): void {
		const die = roll();
		const success = die >= 4;

		message.channel.send(formatResponse([die], success));
	}
}

export class MGRPrettyLikely implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/pretty likely/i);
	}

	public react(message: Discord.Message): void {
		const die = roll();
		const success = die >= 3;

		message.channel.send(formatResponse([die], success));
	}
}

export class MGRReallyLikely implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return !!message.content.match(/really likely/i);
	}

	public react(message: Discord.Message): void {
		const die = roll();
		const success = die >= 2;

		message.channel.send(formatResponse([die], success));
	}
}

function formatResponse(dice: number[], success: boolean): string {
	const result = success ? "succeeded!" : "failed!";
	const diceStr = dice.join(" ");
	return ` rolled ${diceStr} (${result})`;
}

function roll(): number {
	return Math.floor(Math.random() * 6) + 1;
}
