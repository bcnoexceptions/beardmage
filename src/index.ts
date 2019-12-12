import * as Discord from "discord.js";
import * as privateConfig from "./config/private-config.json";
import * as knownUsers from "./knownUsers";
import * as knownCommands from "./knownCommands";
import { messageHandler } from "./messageHandler";
import { syncServer } from "./serverSetup";

const client = new Discord.Client();

client.on("ready", async () => {
    const xcool = client.guilds.array()[0];

    await knownUsers.loadUsers(xcool);
    knownCommands.loadCommands();
    syncServer(xcool);
});

client.on(
    "guildMemberUpdate",
    (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
        knownUsers.renameUser(oldMember, newMember);
    }
);

client.on("message", async (message: Discord.Message) => {
    messageHandler(client, message);
});

client.login(privateConfig.token);
