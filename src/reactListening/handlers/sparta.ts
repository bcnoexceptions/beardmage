import * as Discord from "discord.js";
import { IReactTrigger } from "../mainListener";

export class ReactSparta implements IReactTrigger {
    private lastSparta: Date | null;

    public constructor() {
        this.lastSparta = null;
    }

    public doesReactApply(reaction: Discord.MessageReaction): boolean {
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
        reaction.message.channel.send("https://thumbs.gfycat.com/SinfulDeliciousGraywolf-max-1mb.gif");
    }
}
