import * as Discord from "discord.js";
import * as privateConfig from "./config/private-config.json";
import { UserManager } from "./knownUsers";
import * as knownCommands from "./knownCommands";
import { messageHandler, updateHandler } from "./messageHandler";
import { syncServer } from "./serverSetup";
import { sendWelcomeToUser } from "./sendWelcome";

const client = new Discord.Client();

client.on("ready", async () => {
    const xcool = client.guilds.array()[0];

    await UserManager.getInstance().loadUsers(xcool);
    knownCommands.loadCommands();
    syncServer(xcool);
});

client.on(
    "guildMemberUpdate",
    (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
        UserManager.getInstance().renameUser(oldMember, newMember);
    }
);

client.on("message", async (message: Discord.Message) => {
    messageHandler(client, message);
});

client.on(
    "messageUpdate",
    async (oldMessage: Discord.Message, newMessage: Discord.Message) => {
        updateHandler(client, oldMessage, newMessage);
    }
);

client.on("guildMemberAdd", (member: Discord.GuildMember) => {
    sendWelcomeToUser(member.user);

});

client.login(privateConfig.token);
