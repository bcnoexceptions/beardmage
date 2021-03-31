import * as Discord from "discord.js";
import * as publicConfig from "./config/public-config.json";
import { canPostToChannel } from "./channels";
import { getUserName } from "./knownUsers";
import { sendMessageToChannel } from "./webhooks";

export function syncToGeneral(message: Discord.Message) {
	if (publicConfig.sync) {
		syncMessage(message, publicConfig.generalChannel);
	}
}

export function syncToNoBSChannel(message: Discord.Message) {
	if (publicConfig.sync) {
		syncMessage(message, publicConfig.syncChannel);
	}
}

function syncMessage(message: Discord.Message, channel: string) {
	if (!canPostToChannel(channel)) {
		return;
	}

	const avatarURL = message.author.avatarURL;
	sendMessageToChannel(channel, message.cleanContent, getUserName(message.member), avatarURL);
}
