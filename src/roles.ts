import * as Discord from "discord.js";

//const NewRolePermissions = 116800;  // send messages, embed links, attach files, read history, react
const NewRolePermissions = 0;

export async function findOrCreateRole(server: Discord.Guild, name: string): Promise<Discord.Role> {
	const role = findRole(server, name);
	if (role) {
		return role;
	}
	const newRole = await createRole(server,name)
	assignRoleToAllHumans(server, newRole)
	return newRole;
}

export function findRole(server: Discord.Guild, name: string | null): Discord.Role | null {
	for (const role of server.roles.cache.array()) {
		if (role.name === name) {
			return role;
		}
	}
	return null;
}

export function getAllRoles(server: Discord.Guild): Discord.Role[] {
	return server.roles.cache.array();
}

export async function createRole(server: Discord.Guild, name: string, mentionable?: boolean): Promise<Discord.Role> {
	console.log("creating role " + name);
	const roleData: Discord.RoleData = {
		name: name,
		permissions: NewRolePermissions,
		mentionable: mentionable
	}
	const role = await server.roles.create({data: roleData});
	return role;
}

/**
 * @returns true if role successfully deleted, false otherwise
 */
export async function tryDeleteRole(server: Discord.Guild, name: string): Promise<boolean> {
	for (const role of server.roles.cache.array()) {
		if (role.name === name) {
			console.log("deleting role " + name);
			await role.delete();
			return true;
		}
	}
	return false;
}

export async function addRoleToMembers(roleToAdd: Discord.Role, toAddTo: Discord.GuildMember[], failures: Discord.GuildMember[]) {
	for (const member of toAddTo) {
		try {
			await member.roles.add(roleToAdd);
		} catch {
			failures.push(member);
		}
	}
}

export async function removeRoleFromMembers(roleToRemove: Discord.Role, toRemoveFrom: Discord.GuildMember[], failures: Discord.GuildMember[]): Promise<void> {
	for (const member of toRemoveFrom) {
		try {
			await member.roles.remove(roleToRemove);
		} catch {
			failures.push(member);
		}
	}
}

export function getUsersWithRole(server: Discord.Guild, role: Discord.Role): Discord.GuildMember[] {
	return role.members.array();
}

async function assignRoleToAllHumans(server:Discord.Guild, newRole: Discord.Role): Promise<void> {
	// assign it to all non-bots on the server
	const allMembers = server.members.cache.array();
	const humanMembers: Discord.GuildMember[] = allMembers.filter((member) => !member.user.bot)

	const failures: Discord.GuildMember[] = [];
	await addRoleToMembers(newRole, humanMembers, failures);
	// one retry
	if (failures.length > 0) {
		const failedTwice: Discord.GuildMember[] = [];
		await addRoleToMembers(newRole, failures, failedTwice);
	}
}

