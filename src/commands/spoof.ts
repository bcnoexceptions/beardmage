import * as Discord from "discord.js";
import { sendMessageAs, notifyAuthorOfFailure } from "../util";
import { lookupUser, getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {
	const pieces = message.content.split(/\s+/);
	if (pieces.length < 3) {
		notifyAuthorOfFailure(message, "bad spoof!");
		return; // need "!spoof", user, message
	}

	const userToSpoof = pieces[1];

	const userPos = message.content.indexOf(userToSpoof);
	let spoofText = message.content.substring(userPos + userToSpoof.length + 1);

	spoofText = "**" + spoofText; // so people know it's a spoof

	const knownUserRecord = lookupUser(userToSpoof);
	if (knownUserRecord) {
		sendMessageAs(getUserName(knownUserRecord), knownUserRecord.user.avatarURL, spoofText);
	} else {
		sendMessageAs(userToSpoof, "", spoofText);
	}
}

process.help = "!spoof <person> <jawnz>";
