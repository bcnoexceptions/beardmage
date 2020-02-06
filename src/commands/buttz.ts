import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(
        message,
        "BUTTZ",
        "BUTTZ",
        "BUTTZ",
        "",
        "",
        Math.random() < 0.5,
        8
    );
}

process.help = "buttz buttz buttz";
