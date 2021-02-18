import * as Discord from "discord.js";
import { allowSpoof } from "../database";

export default function process(message: Discord.Message): void {
	allowSpoof(message.member.user.username);
    message.author.send("spoofing of you has been enabled");
}

process.help = "Indicate that you are ok with being spoofed";
