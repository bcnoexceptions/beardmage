import * as Discord from "discord.js";
import { handleInsultOrCompliment, ThreePartMessageType } from "../insultOrCompliment";

export default function process(message: Discord.Message): void {
    handleInsultOrCompliment(ThreePartMessageType.Insult, message);
}

process.help = "insult someone";
