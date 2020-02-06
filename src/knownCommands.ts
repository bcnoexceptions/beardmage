import fs from "fs";
import * as Discord from "discord.js";
import { IStringMap } from "./util";

export interface ICommandHandler {
    (message: Discord.Message): void;
    help: string | undefined;
    disabled: boolean | undefined;
    commandName: string | undefined;
}

interface ICommandFile {
    default: ICommandHandler;
}

let commandMap: IStringMap<ICommandHandler> = {};

export async function loadCommands() {
    commandMap = {};

    const files = fs.readdirSync("src/commands");

    for (const file of files) {
        const path = `./commands/${file}`;
        let commandMod: ICommandFile;
        try {
            delete require.cache[require.resolve(path)];
            commandMod = await import(path);
        } catch (e) {
            console.log("Error during invalidation: " + e);
            continue;
        }
        const name = file.replace(".ts", "");

        const handler = commandMod.default;
        handler.commandName = name;
        if (!handler.disabled) {
            commandMap[name.toUpperCase()] = handler;
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
