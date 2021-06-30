import * as Discord from "discord.js";
import { IReactTrigger } from "../mainListener";

export class ReactSparta implements IReactTrigger {
    private lastSparta: Date | null;

    private repliedToIDs: string[] = [];

    public constructor() {
        this.lastSparta = null;
    }

    public doesReactApply(reaction: Discord.MessageReaction): boolean {
        const messageID = reaction.message.id;
        if (this.repliedToIDs.indexOf(messageID) >= 0) { return false; }

        if (reaction.emoji.name !== "100" && reaction.emoji.name !== '💯') { return false; }

		// Must be THREE hundred
		if (reaction.count !== 3) { return false; }

        // give it ten minutes
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime());
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

        if (!this.lastSparta || tenMinutesAgo > this.lastSparta) {
            this.lastSparta = now;
            return true;
        }
        return false;
    }

    public react(reaction: Discord.MessageReaction, user: Discord.PartialUser | Discord.User): void {
        const message = reaction.message;

        // use lineReply from discord-reply
        (message as any).lineReplyNoMention("https://tenor.com/view/sparta-kick-get-lost-gif-14684072");

        this.repliedToIDs.push(message.id);
    }
}
