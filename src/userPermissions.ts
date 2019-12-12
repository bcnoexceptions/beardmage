import * as Discord from "discord.js";
import { getChannelInfo } from "./database";
import { notifyAuthorOfFailure } from "./util";
import { findRole } from "./roles";

export function addMessageAuthorToChannel(
    message: Discord.Message,
    channelName: string
) {
    const roleName = getRoleNameForChannel(channelName);
    const role = findRole(message.guild, roleName);
    if (!role) {
        notifyAuthorOfFailure(
            message,
            `Could not find role for channel ${channelName}`
        );
        return;
    }

    message.member.addRole(role);
    message.author.send(`Added channel ${channelName}`);
}

export function removeMessageAuthorFromChannel(
    message: Discord.Message,
    channelName: string
) {
    const roleName = getRoleNameForChannel(channelName);
    const role = findRole(message.guild, roleName);
    if (!role) {
        notifyAuthorOfFailure(
            message,
            `Could not find role for channel ${channelName}`
        );
        return;
    }

    message.member.removeRole(role);
    message.author.send(`Removed channel ${channelName}`);
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
