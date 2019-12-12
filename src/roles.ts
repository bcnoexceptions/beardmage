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

export function findRole(server: Discord.Guild, name: string): Discord.Role | null {
	for (const role of server.roles.array()) {
		if (role.name === name) {
			return role;
		}
	}

	return null;
}

export async function createRole(server: Discord.Guild, name: string): Promise<Discord.Role> {
	console.log("creating role " + name);
	return server.createRole({ name, permissions: NewRolePermissions });
}
