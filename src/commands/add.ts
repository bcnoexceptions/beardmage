import * as Discord from "discord.js";
import { notifyAuthorOfFailure } from "../util";
import { addDatabaseOption } from "../database";

export default function process(message: Discord.Message): void {
    const pieces = message.content.split(/\s+/);
    if (pieces.length < 3) {
        notifyAuthorOfFailure(
            message,
            "Usage: !add <which list> <what to add>"
        );
    }

    const which = pieces[1];
    let newEntry: string;

    const hasSubList = which === "insult" || which === "compliment";
    let whichSubList = -1;
    if (hasSubList) {
        whichSubList = parseInt(pieces[2]);
        if (whichSubList > 3 || whichSubList < 1 || isNaN(whichSubList)) {
            notifyAuthorOfFailure(message, "there are only three parts");
            return;
        }
        let listPos = message.content.indexOf(pieces[2]);
        newEntry = message.content.substring(listPos + pieces[2].length + 1);
    } else {
        let listPos = message.content.indexOf(which);
        newEntry = message.content.substring(listPos + which.length + 1);
    }

    switch (which) {
        case "insult":
            addDatabaseOption(which + whichSubList.toString(), newEntry);
            break;
        case "compliment":
            addDatabaseOption(which + whichSubList.toString(), newEntry);
            break;
        default:
            notifyAuthorOfFailure(
                message,
                "unknown list. Known lists: 'insult 1', 'insult 2', 'insult 3', 'compliment 1', 'compliment 2', 'compliment 3'"
            );
            break;
    }
}

process.help =
    "!add <insult 1|insult 2|insult 3|compliment 1|compliment 2|compliment 3> <message>";
