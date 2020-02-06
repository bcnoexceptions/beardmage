import * as Discord from "discord.js";
import { IBotTrigger } from "../contextualResponses";

export class ChatSlaveLunch implements IBotTrigger {
    private lastLunch: Date | null;

    public constructor() {
        this.lastLunch = null;
    }

    public doesMessageApply(message: Discord.Message): boolean {
        if (!message.content.match(/lunch/i)) {
            return false;
        }

        // give it an hour
        const now = new Date();
        const anHourAgo = new Date(now.getTime());
        anHourAgo.setHours(anHourAgo.getHours() - 1);

        if (!this.lastLunch || anHourAgo > this.lastLunch) {
            this.lastLunch = now;
            return true;
        }
        return false;
    }

    public react(message: Discord.Message): void {
        message.channel.send("lunch?");
    }
}
