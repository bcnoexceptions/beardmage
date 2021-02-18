import * as Discord from "discord.js";
import { disallowSpoof } from "../database";

export default function process(message: Discord.Message): void {
	disallowSpoof(message.member.user.username);
    message.author.send("spoofing of you has been disabled");
}

process.help = "Indicate that you don't want to be spoofed";
