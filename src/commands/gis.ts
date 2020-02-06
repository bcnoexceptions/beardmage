import * as Discord from "discord.js";
import { exec } from "child_process";
import { notifyAuthorOfFailure } from "../util";

export default function process(message: Discord.Message): void {
    const searchTerm = message.content.substring("!gis ".length);

    let googleTerm = searchTerm.replace(" ", "+");
    googleTerm = googleTerm.replace("'", "'\\''"); // prevent injection!

    let command = `perl ~/coolchat/GIS.pl '${googleTerm}'`;

    exec(command, (errMessage, stdout, stderr) => {
        if (errMessage) {
            notifyAuthorOfFailure(
                message,
                `Could not run !gis: ${errMessage.message}`
            );
        } else {
            const gisResult = stdout.trim();

            let botPost: string;
            if (gisResult.startsWith("http")) {
                botPost = `First GIS result for "${searchTerm}": ${gisResult}`;
            } else {
                botPost = `Couldn't find search results for "${searchTerm}"`;
            }
            message.channel.send(botPost);
        }
    });
}

process.help = "Google image search some jawnz";
