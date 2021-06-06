
import * as Discord from "discord.js";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";


export default function process(message: Discord.Message): void {
	const userName = getUserName(message.member as Discord.GuildMember);
	const text = `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nHOLD IT!\n${userName} would like to say: ${getRandomShittyPause()} \n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`;

	tryToPostInSameChannel(message,
		text
		,userName
		,"Can't spoof on this channel"
		);

}


function getRandomShittyPause() {
	const prompts = [
		"Are you actively resisting the learning and anti-racist work we are learing about right now?",
		"Are you intending to throw up a barrier because that's what it sounds like?",
		"I'm trying to continue on my equity journey, what you are saying is not helping with this journey"
	];

	const idx = getRandomInt(prompts.length)
	return prompts[idx];
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

process.help = "Announce that chat has gotten heated, and escalate that jawnz";
