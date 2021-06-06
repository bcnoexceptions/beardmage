import * as Discord from "discord.js";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {
    let result: string;
    let rNum = Math.floor(Math.random() * 8) + 1;
    switch (rNum) {
        case 1:
            result = "BLOODSHED";
            break;
        case 2:
            result = "WOODSHED";
            break;
        case 3:
            result = "IF YOU'RE GONNA DIE";
            break;
        case 4:
            result = "WAR FOR TERRITORY";
            break;
        case 5:
            result = "ANY SKELETONS?";
            break;
        case 6:
            result = "MANY SKELETONS!";
            break;
        case 7:
            result = "intro";
            break;
        case 8:
        default:
            result = "I HAVE TOO MANY PENISES TO BE DENIED!";
            break;
        //TODO: case 9 : slashComment(random user)
    }

    tryToPostInSameChannel(
        message,
        result,
        getUserName(message.member as Discord.GuildMember),
        "Can't spoof on this channel"
    );
}

process.help = "introduce yourself BC-style";
