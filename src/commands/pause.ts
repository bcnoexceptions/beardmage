import * as Discord from "discord.js";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {

	const name = getUserName(message.member as Discord.GuildMember);
	const text = `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nHOLD IT!\n${name} requests a pause\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`;

    tryToPostInSameChannel(
        message,
        text,
        name,
        "Can't spoof on this channel"
    );
} 

process.help = "Announce that chat has gotten heated, and there's a situation that needs to be resolved";
