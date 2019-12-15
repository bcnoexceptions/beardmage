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
	const role = findRole(message.guild, roleName);
	if (!role) {
		notifyAuthorOfFailure(message, `Could not find role for channel ${channelName}`);
		return;
	}

	await message.member.addRole(role);
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
	const role = findRole(message.guild, roleName);
	if (!role) {
		notifyAuthorOfFailure(message, `Could not find role for channel ${channelName}`);
		return;
	}

	await message.member.removeRole(role);
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

	if (user.roles.find(role => role.name === roleName)) {
		return true;
	}
	return false;
}
