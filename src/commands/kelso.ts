import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "B", "U", "RN", "!  EPIC BURN", "!", Math.random() < 0.5);
}

process.help = "gonna need some ointment for that burn";
