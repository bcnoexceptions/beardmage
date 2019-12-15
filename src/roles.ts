import * as Discord from "discord.js";

//const NewRolePermissions = 116800;  // send messages, embed links, attach files, read history, react
const NewRolePermissions = 0;

export async function findOrCreateRole(server: Discord.Guild, name: string): Promise<Discord.Role> {
	const role = findRole(server, name);
	if (role) {
		return role;
	}
	return createRole(server, name);
}

export function findRole(server: Discord.Guild, name: string | null): Discord.Role | null {
	for (const role of server.roles.array()) {
		if (role.name === name) {
			return role;
		}
	}

	return null;
}

export async function createRole(server: Discord.Guild, name: string): Promise<Discord.Role> {
	console.log("creating role " + name);
	const role = await server.createRole({ name, permissions: NewRolePermissions });

	// assign it to all users on the server
	let allMembers = server.members.array();
	const failures: Discord.GuildMember[] = [];

	const addRoleToMembers = async (toAddTo: Discord.GuildMember[], failures: Discord.GuildMember[]) => {
		for (const member of toAddTo) {
			if (member.user.bot) {
				continue;
			}
			try {
				await member.addRole(role);
			} catch {
				failures.push(member);
			}
		}
	};

	await addRoleToMembers(allMembers, failures);
	// one retry
	if (failures.length > 0) {
		const failedTwice: Discord.GuildMember[] = [];
		await addRoleToMembers(failures, failedTwice);
	}

	return role;
}
