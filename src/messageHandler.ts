import * as Discord from "discord.js";
import { handleCommand } from "./commandHandling";
import * as publicConfig from "./config/public-config.json";
import { syncToGeneral, syncToNoBSChannel } from "./sync";
import { themeIfAppropriate } from "./theming";
import { ChatMage } from "./chimingIn/contextualResponses";
import { ChannelType } from "discord.js";

export async function messageHandler(client: Discord.Client, message: Discord.Message) {
	if (message.author.bot) {
		return;
	}

	if (message.channel.type === ChannelType.DM) {
		return;
	}
	const channelName = (message.channel as Discord.TextChannel).name;

	if (channelName === publicConfig.syncChannel) {
		// sync the message back from the nobs-chat channel, then leave it alone
		syncToGeneral(message);
		return;
	}

	if (publicConfig.permittedChannels.indexOf(channelName) < 0) {
		// we're not wanted here
		return;
	}

	if (message.content.startsWith("!")) {
		try {
			handleCommand(message);
		} catch (e) {
			processError(e); // log somewhere??
		}
	} else if (channelName === publicConfig.generalChannel) {
		// sync to #nobs-chat
		syncToNoBSChannel(message);
	}

	themeIfAppropriate(message);
	ChatMage.getInstance().processMessage(message);
}

export async function updateHandler(
	client: Discord.Client,
	oldMessage: Discord.Message,
	newMessage: Discord.Message) {
	if (oldMessage.author.bot) {
		return;
	}

	if (oldMessage.channel.type === ChannelType.DM) {
		return;
	}

	const oldText: string = oldMessage.content;
	const newText: string = newMessage.content;

	if (oldText == newText) {
		return;
	}

	const channelName = (oldMessage.channel as Discord.TextChannel).name;

	if (channelName === publicConfig.generalChannel) {
		// let #nobs-chat know about the update
		syncToNoBSChannel(__generateEditedMessage(newMessage));
	}

	if (channelName === publicConfig.syncChannel) {
		// sync the message back from the nobs-chat channel, then leave it alone
		syncToGeneral(__generateEditedMessage(newMessage));
		return;
	}
}

export function __generateEditedMessage(message: Discord.Message): Discord.Message {
	message.content = "Edit: " + message.content;
	return message;
}

function processError(e: unknown) {
	let msg = "<unknown error>";
    if (typeof e === "string") {
        msg = e;
    }
    else if (e instanceof Error) {
        msg = e.message;
    }
    console.log(msg);
}
