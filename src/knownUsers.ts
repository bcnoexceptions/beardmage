import * as Discord from "discord.js";
import { IStringMap } from "./util";

const knownUsers: IStringMap<Discord.GuildMember> = {};

export async function loadUsers(server: Discord.Guild) {
	const fullGuild = await server.fetchMembers();
	const users = fullGuild.members.array();
	for (const user of users) {
		addUser(user);
	}
}

export function addUser(user: Discord.GuildMember) {
	const name = getUserName(user);
	knownUsers[name.toUpperCase()] = user;
}

export function getUserName(user: Discord.GuildMember) {
	let name = user.nickname;
	if (!name) {
		name = user.user.username;
	}
	return name;
}

export function renameUser(oldUser: Discord.GuildMember, newUser: Discord.GuildMember) {
	delete knownUsers[getUserName(oldUser).toUpperCase()];
	addUser(newUser);
}

export function lookupUser(name: string): Discord.GuildMember | null {
	if (knownUsers[name.toUpperCase()]) {
		return knownUsers[name.toUpperCase()];
	}

	if (name.startsWith("<@")) {
		const id = name.slice(2, -1);
		for (const userName of Object.keys(knownUsers)) {
			if (knownUsers[userName].id === id) {
				return knownUsers[userName];
			}
		}
	}

	return null;
}

export function logUsers() {
	for (const name of Object.keys(knownUsers)) {
		console.log(getUserName(knownUsers[name]));
	}
}
