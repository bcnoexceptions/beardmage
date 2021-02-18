import * as Discord from "discord.js";
import { handleInsultOrCompliment, ThreePartMessageType } from "../insultOrCompliment";

export default function process(message: Discord.Message): void {
    handleInsultOrCompliment(ThreePartMessageType.Compliment, message, true);
}

process.help = "compliment someone in a clumsy or oafish manner";
