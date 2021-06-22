import * as Discord from "discord.js";
import * as privateConfig from "./config/private-config.json";
import { UserManager } from "./knownUsers";
import * as knownCommands from "./knownCommands";
import { messageHandler, updateHandler } from "./messageHandler";
import { syncServer } from "./serverSetup";
import { sendWelcomeToUser } from "./sendWelcome";
import { ReactHandler } from "./reactListening/mainListener";

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

client.on("messageReactionAdd", (reaction: Discord.MessageReaction, user: Discord.PartialUser | Discord.User) => {
    ReactHandler.getInstance().processReact(reaction, user);
});

// Need to jump through this hoop to actually process new reacts
// https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
client.on('raw', packet => {
    onRaw(packet);
});

async function onRaw(packet: IPacket): Promise<void> {
    if (packet.t !== 'MESSAGE_REACTION_ADD') { return; }

    const channel = await client.channels.fetch(packet.d.channel_id);

    // There's no need to emit if the message is cached, because the event will fire anyway for that
    const messages = (channel as Discord.TextChannel).messages;
    if (messages && messages.cache.has(packet.d.message_id)) { return; }

    const message = await messages.fetch(packet.d.message_id);

    const emojiData = packet.d.emoji;
    if (!emojiData) { return; }

    const emoji = emojiData.id ? `${emojiData.name}:${emojiData.id}` : emojiData.name;
    const reaction = message.reactions.resolve(emoji);
    if (!reaction) { return; }

    const user = await client.users.fetch(packet.d.user_id);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction) { reaction.users.add(user); }

    client.emit('messageReactionAdd', reaction, user);
}

interface IPacket {
    t: string;
    d: {
        channel_id: string;
        message_id: string;
        user_id: string;
        emoji?: {
            id: string;
            name: string;
        }
    }
}

client.login(privateConfig.token);
