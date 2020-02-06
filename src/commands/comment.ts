import * as Discord from "discord.js";
import { handleInsultOrCompliment } from "../insultOrCompliment";

export default function process(message: Discord.Message): void {
    handleInsultOrCompliment("comment", message);
}

process.help = "say something about someone";
