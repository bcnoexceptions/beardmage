import * as Discord from "discord.js";
import { handleInsultOrCompliment } from "../insultOrCompliment";

export default function process(message: Discord.Message): void {
    handleInsultOrCompliment("compliment", message, true);
}

process.help = "compliment someone in a clumsy or oafish manner";
