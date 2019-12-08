import * as Discord from "discord.js";
import { handleInsultOrCompliment } from "../insultOrCompliment";

export default function process(message: Discord.Message): void {
    handleInsultOrCompliment("insult", message);
}

process.help = "!compliment <person>";
