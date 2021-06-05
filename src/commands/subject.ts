import * as Discord from "discord.js";
import { getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {
    const newSubject = message.content.substring("!subject ".length);

    const channel = message.channel as Discord.TextChannel;
    channel.setTopic(newSubject);

    const name = getUserName(message.member as Discord.GuildMember);
    channel.send(`${name} changed the subject to "${newSubject}"`);
}

process.help = "change the subject";
