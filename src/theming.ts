import { IStringMap } from "./util";
import * as Discord from "discord.js";
import { isPersonThemed } from "./database";
import * as publicConfig from "./config/public-config.json";
import { tryToPostInSameChannel } from "./channels";
import { getUserName } from "./knownUsers";

type EmojiList = Discord.Collection<string, Discord.Emoji>;

const ThemingIsOn = false;

export function themeIfAppropriate(message: Discord.Message): void {
	if (!isPersonThemed(message.author.username)) {
		return;
	}

	if (!ThemingIsOn) {
		return; //*BC people didn't like this, put in an off switch for now
	}

	if (message.embeds && message.embeds.length > 0) {
		return; // don't try to theme these
	}

	const emojis = message.guild.emojis;

	const newContent = replaceWithEmojis(message.content, emojis);
	if (newContent !== message.content) {
		if (tryToPostInSameChannel(message, newContent, getUserName(message.member), "Can't theme on this channel")) {
			message.delete();
		}
	}
}

function replaceWithEmojis(content: string, emojis: EmojiList): string {
	const words = content.split(" ");

	const replaceablesByLength = getSortedReplaceables();

	for (let i = 0; i < words.length; i++) {
		if (words[i].toLowerCase().startsWith("http")) {
			continue; // don't break links
		}

		words[i] = subOneWord(words[i], replaceablesByLength, emojis);
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

function subOneWord(word: string, replaceablesByLength: string[], emojis: EmojiList): string {
	const theme: IStringMap<string> = publicConfig.theme;

	for (let i = 0; i < replaceablesByLength.length; i++) {
		const oldText = replaceablesByLength[i];
		const replacementName = theme[replaceablesByLength[i]];
		const selectedEmoji = emojis.find(e => e.name === replacementName);

		if (!selectedEmoji) {
			continue;
		}

		word = replaceAllCaseInsensitive(word, oldText, selectedEmoji.toString());
	}

	return word;
}

function replaceAllCaseInsensitive(original: string, from: string, to: string): string {
	// https://stackoverflow.com/questions/7313395/case-insensitive-replace-all

	// first escape chars with regex meaning
	var escaped = from.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

	var regex = new RegExp(escaped, "ig");
	return original.replace(regex, to);
}
