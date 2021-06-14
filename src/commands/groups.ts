import * as Discord from "discord.js";
import { addRoleToMembers, createRole, findRole, getAllRoles, removeRoleFromMembers, tryDeleteRole } from "../roles";
import { notifyAuthorOfFailure } from "../util";

export default async function process(message: Discord.Message): Promise<void> {
	
	const args = message.content.split(" ")
	let action: string = ''
	let roleName: string = '';
	try {
		action = args[1].toUpperCase();
		if (action !== "LIST") {
			roleName = makeRoleName(args.slice(2));
			if (!roleName) throw new Error('No role name')
		}
	}
	catch {
		action = "HELP";
	}


	switch (action) {
		case "CREATE":
			await createGroup(message,roleName);
			break;
		case "JOIN":
			await joinGroup(message,roleName);
			break;
		case "LEAVE":
			await leaveGroup(message,roleName);
			break;
		case "DELETE":
			await deleteGroup(message,roleName);
			break;
		case "LIST": 
			listGroups(message);
			break;
		case "HELP": 
		default:
			expandedHelp(message);
			break;

	}
}

async function createGroup(message: Discord.Message, newRoleName: string) {
	const existingRole = findRole(message.guild as Discord.Guild, newRoleName)
	if (existingRole) {
		notifyAuthorOfFailure(message,`Role ${newRoleName} already exists`)
		return;
	}

	const newRole = await createRole(message.guild as Discord.Guild, newRoleName, true)

	message.channel.send(`New group ${newRoleName} created successfully`);
}
async function joinGroup(message: Discord.Message, roleNameToJoin: string) {
	const role = findRole(message.guild as Discord.Guild, roleNameToJoin)

	if (!role) {
		notifyAuthorOfFailure(message, `Group ${roleNameToJoin} does not exist. Use !groups list to see available groups, or !groups create to make one` )
		return;
	}
	const failures: Discord.GuildMember[] = []
	addRoleToMembers(role, [message.member as Discord.GuildMember], failures)

	if (failures.length > 0) {
		notifyAuthorOfFailure(message, "Unable to join group. Try again later, and if that doesn't work, yell at one of the beardmage programmers")
	}
	else {
		message.author.send(`Successfully joined group ${roleNameToJoin}`)
	}
}

async function leaveGroup(message: Discord.Message, roleNameToLeave: string) {
	const role = findRole(message.guild as Discord.Guild, roleNameToLeave)

	if (!role) {
		notifyAuthorOfFailure(message, `Group ${roleNameToLeave} does not exist` )
		return;
	}
	const failures: Discord.GuildMember[] = []
	removeRoleFromMembers(role, [message.member as Discord.GuildMember], failures)

	if (failures.length > 0) {
		notifyAuthorOfFailure(message, "Unable to leave group. Try again later, and if that doesn't work, yell at one of the beardmage programmers")
	}
	else {
		message.author.send(`Successfully left group ${roleNameToLeave}`)
	}
}

async function deleteGroup(message: Discord.Message, roleNameToDelete: string) {
	const guild = message.guild as Discord.Guild
	const success: boolean = await tryDeleteRole(guild, roleNameToDelete);

	if (success) {
		message.channel.send(`Successfully deleted ${roleNameToDelete}`);
	}
	else {
		notifyAuthorOfFailure(message,`Failed to delete ${roleNameToDelete}. Either the role doesn't exist, or Discord said no`);
	}
}

function listGroups(message: Discord.Message) {
	const roles: Discord.Role[] = getAllRoles(message.guild as Discord.Guild);
	const groupRoles: Discord.Role[] = roles.filter((role: Discord.Role) => role.name.startsWith('g-'));

	let listToSend: string = `The following groups are available: `

	for(const role of groupRoles) {
		listToSend += `\n${role.name}`
	}

	message.author.send(listToSend);
}


function expandedHelp(message: Discord.Message) {

	const helpMessage = `
	To ping a group, simply @mention the group name (which will always start with "g-")
	Available commands:
	\`
	!groups create <groupname> - Creates a group
	!groups join <groupname> - Join the group
	!groups leave <groupname> - Leave the group
	!groups delete <groupname> - Delete the group 
	!groups list - Get a PM with all available groups
	!groups help - See this again
	\``
	message.author.send(helpMessage);
}

function makeRoleName(roleNameArray: string[]) {
	if (roleNameArray.length < 1) {
		throw new Error('No name provided');
	}
	const roleName = roleNameArray.join('-');

	if (roleName.startsWith("g-")) return roleName;
	return "g-"+roleName
} 

// uncomment to support !help
process.help = "Create, join and manage ad-hoc groups. Use !groups help for more information"; 
