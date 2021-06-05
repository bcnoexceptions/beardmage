import * as Discord from "discord.js";
import { getNonSpecialChannels, IChannelData } from "../channels";
import { addMessageAuthorToChannel, userHasChannel } from "../userPermissions";

export default async function process(message: Discord.Message): Promise<void> {

	message.member!.send(
		"Beginning to add all channels. Note that this may take a while due to Discord rate limiting ..."
	);

	const allChannels = getNonSpecialChannels();
	const addedChannels: IChannelData[] = [];
	const failedChannels: IChannelData[] = [];

	const addChannelsFromList = async (toTry: IChannelData[], successes: IChannelData[], failures: IChannelData[]) => {
		for (const channel of toTry) {
			try {
				if (!userHasChannel(message.member as Discord.GuildMember, channel.name)) {
					await addMessageAuthorToChannel(message, channel.name);
					successes.push(channel);
				}
			} catch {
				failures.push(channel);
			}
		}
	};

	await addChannelsFromList(allChannels, addedChannels, failedChannels);

	const failedTwice: IChannelData[] = [];
	await addChannelsFromList(failedChannels, addedChannels, failedTwice);

	let channelNames = addedChannels.map(ch => ch.name);
	if (channelNames.length > 0) {
		await message.author.send("Added " + channelNames.toString());
	}

	channelNames = failedChannels.map(ch => ch.name);
	if (channelNames.length > 0) {
		await message.author.send(
			`Timeout while adding ${channelNames.toString()} - retry if they don't show up in a few seconds`
		);
	}
}

process.help = "Grant access to all channels";
