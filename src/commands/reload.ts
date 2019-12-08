import * as Discord from "discord.js";
import * as knownCommands from "../knownCommands";

export default function process(_message: Discord.Message): void {
	knownCommands.loadCommands();
}
