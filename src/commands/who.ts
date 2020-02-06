import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "Y", "E", "AH", "", "!", true);
}

process.help = "summon Roger Daltrey";
