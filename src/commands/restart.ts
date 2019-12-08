import * as Discord from "discord.js";

export default function executeCommand(message: Discord.Message): void {
	console.log("shutting it down ...");
	deleteThenShutdown(message);
}

async function deleteThenShutdown(message: Discord.Message) {
	await message.delete(); // have to do this first because it won't be around later!
	process.exit();
}
