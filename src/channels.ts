import { getWebhookForChannel, loadAllChannels } from "./database";
import * as Discord from "discord.js";
import { sendMessageToChannel } from "./webhooks";
import { notifyAuthorOfFailure } from "./util";
import { findOrCreateRole, findRole } from "./roles";
import { ChannelType } from "discord.js";

export function canPostToChannel(channelName: string): boolean {
	return !!getWebhookForChannel(channelName);
}

/**
 * Try to post in the same channel as a source message
 *
 * @export
 * @param {Discord.Message} message the source message; it's channel and author are used
 * @param {string} text the text to post
 * @param {string} userName the person to spoof
 * @param {string} messageOnFailure what to message the user (if anything) on failure
 * @param {string} avatarURL the image to associated with the user
 * @returns {boolean} true on success
 */
export function tryToPostInSameChannel(
	message: Discord.Message,
	text: string,
	userName: string,
	messageOnFailure: string | null,
	avatarURL?: string
): boolean {
	const channel = (message.channel as Discord.TextChannel).name;
	if (!canPostToChannel(channel)) {
		if (messageOnFailure) {
			notifyAuthorOfFailure(message, messageOnFailure);
		}
		return false;
	}

	if (!avatarURL) {
		avatarURL = message.author.avatarURL() ?? undefined;
	}
	sendMessageToChannel(channel, text, userName, avatarURL);
	return true;
}

export async function findOrCreateChannel(
	server: Discord.Guild,
	channelName: string,
	roleName: string
): Promise<Discord.TextChannel> {
	const role = await findOrCreateRole(server, roleName);

	let channel = findChannel(server, channelName);
	if (!channel) {
		channel = await createChannel(server, channelName, roleName);

		const everyoneRole = await findRole(server, "@everyone");
		if (everyoneRole) {
			await channel.permissionOverwrites.create(everyoneRole, {
				SendMessages: false,
				EmbedLinks: false,
				AddReactions: false,
				AttachFiles: false,
				ReadMessageHistory: false,
				ViewChannel: false,
			});
		}

		await channel.permissionOverwrites.create(role, {
			SendMessages: true,
			EmbedLinks: true,
			AddReactions: true,
			AttachFiles: true,
			ReadMessageHistory: true,
			ViewChannel: true,
		});

		console.log("added role " + roleName + " to #" + channelName);
	}

	return channel;
}

export function findChannel(server: Discord.Guild, channelName: string): Discord.TextChannel | null {
	for (const [name, channel] of server.channels.cache) {
		if (channel.type !== ChannelType.GuildText) {
			continue;
		}

		if ((channel as Discord.TextChannel).name === channelName) {
			return channel as Discord.TextChannel;
		}
	}

	return null;
}

export async function createChannel(
	server: Discord.Guild,
	channelName: string,
	roleName: string
): Promise<Discord.TextChannel> {

	const channel = (
		await server.channels.create({ name: channelName, type: ChannelType.GuildText })
	) as Discord.TextChannel;

	console.log("created channel " + channelName);

	return channel;
}

const SpecialChannels = ["", "admin-chat", "general", "nobs-chat", "xcoolevents"];

export function getNonSpecialChannels(): IChannelData[] {
	const allChannels = loadAllChannels();
	for (let i = allChannels.length - 1; i >= 0; i--) {
		const name = allChannels[i].name;

		if (SpecialChannels.indexOf(name) >= 0) {
			allChannels.splice(i, 1);
		}
	}
	return allChannels;
}

export interface IChannelData {
	name: string;
	role: string;
	webhookID: string;
	webhookToken: string;
}
