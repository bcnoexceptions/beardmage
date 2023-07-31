import fs from "fs";
import * as Discord from "discord.js";
import { IStringMap } from "./util";

export interface ICommandHandler {
    (message: Discord.Message): Promise<void> | void;
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

    const files = fs.readdirSync("src/commands", { withFileTypes: true});

    for (const file of files) {
        if (file.isDirectory()) continue;

        const path = `./commands/${file.name}`;
        let commandMod: ICommandFile;
        try {
            delete require.cache[require.resolve(path)];
            commandMod = await import(path);
        } catch (e) {
            logError(e);
            continue;
        }
        const name = file.name.replace(".ts", "");

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

function logError(e: unknown) {
    let msg = "<unknown>";
    if (typeof e === "string") {
        msg = e;
    }
    else if (e instanceof Error) {
        msg = e.message;
    }
    console.log("Error during invalidation: " + msg);
}