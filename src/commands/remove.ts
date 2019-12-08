import * as Discord from "discord.js";
import { notifyAuthorOfFailure } from "../util";
import { removeDatabaseOption } from "../database";

export default function process(message: Discord.Message): void {
	const pos = message.content.indexOf(" ");
	if (pos < 0) {
		notifyAuthorOfFailure(message, "You need to specify what should be removed");
		return;
	}

	const whatToRemove = message.content.substring(pos + 1);

	removeDatabaseOption("insult1", whatToRemove);
	removeDatabaseOption("insult2", whatToRemove);
	removeDatabaseOption("insult3", whatToRemove);
	removeDatabaseOption("compliment1", whatToRemove);
	removeDatabaseOption("compliment2", whatToRemove);
	removeDatabaseOption("compliment3", whatToRemove);

	message.author.send(`Removed "${whatToRemove}" from all insult/compliment lists`);
}

process.help = "!remove <jawnz>";
