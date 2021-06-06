import * as Discord from "discord.js";
import { getChannelInfo } from "./database";
import { notifyAuthorOfFailure } from "./util";
import { findRole } from "./roles";

export async function addMessageAuthorToChannel(
	message: Discord.Message,
	channelName: string,
	notifySender?: boolean
): Promise<void> {
	const roleName = getRoleNameForChannel(channelName);
	const role = findRole(message.guild as Discord.Guild, roleName);
	if (!role) {
		notifyAuthorOfFailure(message, `Could not find role for channel ${channelName}`);
		return;
	}
	if (!message.member) {
		return;
	}

	await message.member.roles.add(role);
	if (notifySender) {
		await message.author.send(`Added channel ${channelName}`);
	}
}

export async function removeMessageAuthorFromChannel(
	message: Discord.Message,
	channelName: string,
	notifySender?: boolean
): Promise<void> {
	const roleName = getRoleNameForChannel(channelName);
	const role = findRole(message.guild as Discord.Guild, roleName);
	if (!role) {
		notifyAuthorOfFailure(message, `Could not find role for channel ${channelName}`);
		return;
	}
	if (!message.member) {
		return;
	}

	await message.member.roles.remove(role);
	if (notifySender) {
		await message.author.send(`Removed channel ${channelName}`);
	}
}

function getRoleNameForChannel(channelName: string): string | null {
	const channelInfo = getChannelInfo(channelName);
	if (!channelInfo) {
		return null;
	}

	if (!channelInfo.role) {
		return null;
	}

	return channelInfo.role;
}

export function userHasChannel(user: Discord.GuildMember, channelName: string): boolean {
	const roleName = getRoleNameForChannel(channelName);

	if (user.roles.cache.find(role => role.name === roleName)) {
		return true;
	}
	return false;
}
