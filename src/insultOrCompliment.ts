import * as Discord from "discord.js";
import { getRandomDatabaseOption } from "./database";

export enum ThreePartMessageType {
	Compliment = 1,
	Insult = 2,
	Comment = 3,
}

interface NumberToString {
	[which: number]: string;
}
const messageTypeToTable: NumberToString = {};
messageTypeToTable[ThreePartMessageType.Compliment] = "compliment";
messageTypeToTable[ThreePartMessageType.Insult] = "insult";
messageTypeToTable[ThreePartMessageType.Comment] = "comment";


export function handleInsultOrCompliment(which: ThreePartMessageType, message: Discord.Message, isPlomp?: boolean) {
	const text = message.content;
	const firstWord = text.split(/\s+/)[0];
	const whom = message.content.substring(firstWord.length + 1);

	//Initialize all 3 tables as "which", handle "comment" specially
	let table1 = messageTypeToTable[which];
	let table2 = messageTypeToTable[which];
	let table3 = messageTypeToTable[which];
	let punct = "!";
	if (which === ThreePartMessageType.Comment) {		
		table1 = randomSentimentTable();
		table2 = randomSentimentTable();
		table3 = randomSentimentTable();
		
		punct = ".";
	}
	const part1: string = getRandomDatabaseOption(table1 + "1");
	const part2: string = getRandomDatabaseOption(table2 + "2");
	const part3: string = getRandomDatabaseOption(table3 + "3");

	const part1StartsVowel = "aeiou".indexOf(part1[0]) >= 0;
	const article = part1StartsVowel ? "an" : "a";

	let result: string;
	if (whom) {
		result = `${whom}, you're ${article} ${part1} ${part2} ${part3}` + punct;
	} else {
		result = `You're ${article} ${part1} ${part2} ${part3}` + punct;
	}

	if (isPlomp) { result = plompify(result); }

	message.channel.send(result);
}

function randomSentimentTable(): string
{
	if (Math.random() > 0.5) { return messageTypeToTable[ThreePartMessageType.Compliment]; }
	else { return messageTypeToTable[ThreePartMessageType.Insult]; }
}

function plompify(result: string): string {
	const plomp = "Plomp";
	const words = result.split(" ");
	const len: number = words.length;
	result = "";
	for (let word of words) {
		let rand: number = Math.floor(Math.random() * len / 2);
		if (rand === 0) {
			result += plomp;
		} else {
			result += word;
		}

		result += " ";
	}

	result = result.substring(0, result.length - 1); //Truncate trailing space.
	return result;
}
