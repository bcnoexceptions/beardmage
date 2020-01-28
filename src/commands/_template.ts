/** THIS COMMAND DOES NOTHING! It's just a template! */

import * as Discord from "discord.js";

export default function process(_message: Discord.Message): void {
	//
}

// uncomment to support !help
//process.help = "run my sweet command!";

// get rid of this - you want your command to be enabled!
process.disabled = true;
