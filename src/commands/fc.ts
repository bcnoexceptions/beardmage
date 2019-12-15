import * as Discord from "discord.js";

import * as privateConfig from "../config/private-config.json";

export default function process(message: Discord.Message): void {
	message.author.send(privateConfig.friendCodes);
}

process.help = "Send you the link to the friend codes spreadsheet";
