import * as Discord from "discord.js";
import * as privateConfig from "./config/private-config.json";
import { UserManager } from "./knownUsers";
import * as knownCommands from "./knownCommands";
import { messageHandler, updateHandler } from "./messageHandler";
import { syncServer } from "./serverSetup";
import { sendWelcomeToUser } from "./sendWelcome";

const client = new Discord.Client();

client.on("ready", async () => {
    const xcool = client.guilds.cache.array()[0];

    await UserManager.getInstance().loadUsers(xcool);
    knownCommands.loadCommands();
    syncServer(xcool);
});

//We don't have partials enabled so we should never get them, but still need to handle the types
//https://discordjs.guide/popular-topics/partials.html#enabling-partials
//¯\_(ツ)_/¯
client.on(
    "guildMemberUpdate",
    (oldMember: Discord.GuildMember | Discord.PartialGuildMember, newMember: Discord.GuildMember) => {
        UserManager.getInstance().renameUser(oldMember as Discord.GuildMember, newMember);
    }
);

client.on("message", async (message: Discord.Message) => {
    messageHandler(client, message);
});

client.on(
    "messageUpdate",
    async (oldMessage: Discord.Message | Discord.PartialMessage, newMessage: Discord.Message | Discord.PartialMessage) => {
        updateHandler(client, oldMessage as Discord.Message, newMessage as Discord.Message);
    }
);

client.on("guildMemberAdd", (member: Discord.GuildMember) => {
    sendWelcomeToUser(member.user);

});

client.login(privateConfig.token);
