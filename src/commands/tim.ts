import * as Discord from "discord.js";
import { randChat } from "../randChat";

export default function process(message: Discord.Message): void {
    randChat(message, "D", "A", "NG", " GURRRRRRRL", "!", Math.random() < 0.5);
}

process.help = "summon the spirit of TIMOOOO, god of coolchat";
