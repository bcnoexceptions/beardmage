import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "INTENS", "O", "", "", "", true, 11);
}

process.help = "be very intense";
