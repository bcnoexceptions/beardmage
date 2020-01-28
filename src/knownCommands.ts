import fs from "fs";
import * as Discord from "discord.js";
import { IStringMap } from "./util";

export interface ICommandHandler {
	(message: Discord.Message): void;
	help: string | undefined;
	disabled: boolean | undefined;
}

let commandMap: IStringMap<ICommandHandler> = {};

export async function loadCommands() {
	commandMap = {};

	const files = fs.readdirSync("src/commands");

	for (const file of files) {
		const path = `./commands/${file}`;
		try {
			delete require.cache[require.resolve(path)];
		} catch (e) {
			console.log("Error during invalidation: " + e);
		}
		const commandMod = await import(path);
		const name = file.replace(".ts", "").toUpperCase();

		const handler = commandMod.default as ICommandHandler;
		if (!handler.disabled) {
			commandMap[name] = handler;
		}
	}
}

export function getCommand(name: string): ICommandHandler | null {
	const upper = name.toUpperCase();
	if (commandMap[upper]) {
		return commandMap[upper];
	}
	return null;
}

export function getAllCommands(): ICommandHandler[] {
	const result: ICommandHandler[] = [];

	for (const key of Object.keys(commandMap)) {
		const val = commandMap[key];
		if (typeof val === "function") {
			result.push(val);
		}
	}

	return result;
}
