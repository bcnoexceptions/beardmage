import * as Discord from "discord.js";
import * as privateConfig from "./config/private-config.json";
import * as knownUsers from "./knownUsers";
import * as knownCommands from "./knownCommands";
import { handleCommand } from "./commandHandling";

const client = new Discord.Client();

const permittedChannels = ["general"];

client.on("ready", async () => {
    await knownUsers.loadUsers(client.guilds.array()[0]);

    knownCommands.loadCommands();
});

client.on(
    "guildMemberUpdate",
    (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
        knownUsers.renameUser(oldMember, newMember);
    }
);

client.on("message", async (message: Discord.Message) => {
    if (message.author.bot) {
        return;
    }

    if (message.channel.type === "dm") {
        return;
    }
    const channelName = (message.channel as Discord.TextChannel).name;
    if (permittedChannels.indexOf(channelName) < 0) {
        return;
    }

    if (message.content.startsWith("!")) {
        try {
            handleCommand(client, message);
        } catch (e) {
            console.log(e); // log somewhere??
        }
    }
});

client.login(privateConfig.token);
