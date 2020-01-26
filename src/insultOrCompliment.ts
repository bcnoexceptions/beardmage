import * as Discord from "discord.js";
import { getRandomDatabaseOption } from "./database";
import { tryToPostInSameChannel } from "./channels";
import { getUserName } from "./knownUsers";

export function handleInsultOrCompliment(which: string, message: Discord.Message, isPlomp?: boolean) {
	const whom = message.content.substring(`!${which} `.length);
	//Initialize all 3 tables as "which", handle "comment" specially
	let table1: string = which;
	let table2: string = which;
	let table3: string = which;
	if (which === "comment") {		
		const rNum = Math.floor(Math.random() * 8);
		//3-bit integer determines each of the 3 tables, 000-111
		/*000 = III
		  001 = IIC
		  010 = ICI
		  011 = ICC
		  100 = CII
		  101 = CIC
		  110 = CCI
		  111 = CCC*/
		//Most significant bit determines table 1
		if (rNum < 4) {
			table1 = "insult";
		} else {
			table1 = "compliment";
		}
		//2nd bit determines table 2
		if (rNum % 4 === 0 || rNum % 4 === 1) {
			table2 = "insult";
		} else {
			table2 = "compliment";
		}
		//Least significant bit determines table 3
		if (rNum % 2 === 0) {
			table3 = "insult";
		} else {
			table3 = "compliment";
		}
	}
	const part1: string = getRandomDatabaseOption(table1 + "1");
	const part2: string = getRandomDatabaseOption(table2 + "2");
	const part3: string = getRandomDatabaseOption(table3 + "3");

	const part1StartsVowel = "aeiou".indexOf(part1[0]) >= 0;
	const article = part1StartsVowel ? "an" : "a";

	let result: string;
	if (whom) {
		result = `${whom}, you're ${article} ${part1} ${part2} ${part3}!`;
	} else {
		result = `You're ${article} ${part1} ${part2} ${part3}!`;
	}

	if (isPlomp) {
		let plomp: string = "Plomp";
		let words: string[] = result.split(" ");
		let len: number = words.length;
		result = "";
		for (let word of words) {
			let rand: number = Math.floor(Math.random() * len/2);
			if (rand === 0) {
				result += plomp;
			} else {
				result += word;
			}

			result += " ";
		}

		result = result.substring(0, result.length - 1);  //Truncate trailing space.
	}

	tryToPostInSameChannel(message, result, getUserName(message.member), "Can't spoof on this channel");
}
