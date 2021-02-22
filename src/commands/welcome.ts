import * as Discord from "discord.js";
import { sendWelcomeToUser } from "../sendWelcome";
import { notifyAuthorOfFailure } from "../util";

export default async function process(message: Discord.Message): Promise<void> {
    const success = await sendWelcomeToUser(message.author)
	if (!success) {
        notifyAuthorOfFailure(message,"Error sending welcome message");
    }
}

// uncomment to support !help
process.help = "Send the discord welcome message & FAQ";
