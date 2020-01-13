import { IStringMap } from "./util";
import * as Discord from "discord.js";
import { isPersonThemed } from "./database";
import * as publicConfig from "./config/public-config.json";
import { tryToPostInSameChannel } from "./channels";
import { getUserName } from "./knownUsers";

export function themeIfAppropriate(message: Discord.Message): void {
	if (!isPersonThemed(message.author.username)) {
		return;
	}

	if (message.embeds && message.embeds.length > 0) {
		return; // don't try to theme these
	}

	const newContent = replaceWithEmojis(message.content);
	if (newContent !== message.content) {
		if (
			tryToPostInSameChannel(
				message,
				newContent,
				getUserName(message.member),
				"Can't theme on this channel"
			)
		) {
			message.delete();
		}
	}
}

function replaceWithEmojis(content: string): string {
	const words = content.split(" ");

	const replaceablesByLength = getSortedReplaceables();

	for (let i = 0; i < words.length; i++) {
		if (words[i].toLowerCase().startsWith("http")) {
			continue; // don't break links
		}

		words[i] = subOneWord(words[i], replaceablesByLength);
	}

	return words.join(" ");
}

function getSortedReplaceables(): string[] {
	const replaceablesByLength: string[] = [];
	for (let key in publicConfig.theme) {
		replaceablesByLength.push(key);
	}
	replaceablesByLength.sort((a: string, b: string) => b.length - a.length);

	return replaceablesByLength;
}

function subOneWord(word: string, replaceablesByLength: string[]): string {
	const theme: IStringMap<string> = publicConfig.theme;

	// first replace everything with ##REPLACE{i}##

	for (let i = 0; i < replaceablesByLength.length; i++) {
		const oldText = replaceablesByLength[i];
		const replacement = `##REPLACE${i}##`;

		word = replaceAllCaseInsensitive(word, oldText, replacement);
	}

	// now replace ##REPLACE{i}## with the actual replacement. This way we don't double-replace stuff

	for (let i = 0; i < replaceablesByLength.length; i++) {
		const oldText = `##REPLACE${i}##`;
		const replacement = theme[replaceablesByLength[i]];

		word = replaceAllCaseInsensitive(word, oldText, replacement);
	}

	return word;
}

function replaceAllCaseInsensitive(
	original: string,
	from: string,
	to: string
): string {
	// https://stackoverflow.com/questions/7313395/case-insensitive-replace-all

	// first escape chars with regex meaning
	var escaped = from.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

	var regex = new RegExp(escaped, "ig");
	return original.replace(regex, to);
}
