import * as Discord from "discord.js";
import { handleInsultOrCompliment } from "../insultOrCompliment";

export default function process(message: Discord.Message): void {
    handleInsultOrCompliment("compliment", message);
}

process.help = "compliment someone";
