import * as Discord from "discord.js";
import { randChat } from "../randChat";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {
	let result: string;
	let rNum = Math.floor(Math.random() * 6) + 1;
	switch (rNum) {
		case 1:
			result = " tries to ford the river. His oxen die.";
			break;
		case 2:
			result = " dies of dystentery.  He has lost the game.";
			break;
		case 3:
			let weight1: number = Math.floor(Math.random() * 22400) + 1600;
			let weight2: number = Math.round(weight1 / 1600);
			result = " has hunted " + weight1 + " lbs. of buffalo.  He has room to carry away " + weight2 + " lbs.";
			break;
		case 4:
			result = " no longer has dysentery!";
			break;
		case 5:
			result = " catches cholera.  At least it's not dystentery.";
			break;
		case 6:
		default:
			result = " chooses to wait until river conditions improve.";
			break;			
	}

	result = getUserName(message.member) + result;

	tryToPostInSameChannel(message, result, "beardslave", "Can't spoof on this channel");
}

process.help = "!trail plays the Oregon Trail";
