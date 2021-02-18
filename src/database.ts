import sqlite from "better-sqlite3";
import * as publicConfig from "./config/public-config.json";
import { IWebhook } from "./webhooks";
import { IChannelData } from "./channels.js";

/** Always pass `table` in hard-coded from TS, to avoid injection! */
export function addDatabaseOption(table: string, value: string): void {
	const db = new sqlite(publicConfig.listFile);
	const statement = db.prepare(`INSERT INTO ${table} (value) VALUES (?)`);
	statement.run(value);
}

/** Always pass `table` in hard-coded from TS, to avoid injection! */
export function getRandomDatabaseOption(table: string): string {
	const db = new sqlite(publicConfig.listFile);
	const statement = db.prepare(`SELECT value FROM ${table}`);
	const rows = statement.all();
	const num = rows.length;

	if (num === 0) {
		return "";
	}

	const randint = Math.floor(Math.random() * num);
	return rows[randint].value;
}

/** Always pass `table` in hard-coded from TS, to avoid injection! */
export function removeDatabaseOption(table: string, value: string): void {
	const db = new sqlite(publicConfig.listFile);
	const statement = db.prepare(`DELETE FROM ${table} WHERE value = (?)`);
	statement.run(value);
}

export function getWebhookForChannel(channelName: string): IWebhook | null {
	const channelInfo = getChannelInfo(channelName);
	if (!channelInfo) {
		return null;
	}

	return { ID: channelInfo.webhookID, token: channelInfo.webhookToken };
}

export function getChannelInfo(channelName: string): IChannelData | null {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`SELECT channel as name, role, webhookID, webhookToken FROM channels WHERE channel = (?)`
	);
	const rows = statement.all(channelName);
	const num = rows.length;

	if (num === 0) {
		return null;
	}

	return {
		name: rows[0].name,
		role: rows[0].role,
		webhookID: rows[0].webhookID,
		webhookToken: rows[0].webhookToken
	};
}

export function loadAllChannels(): IChannelData[] {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`SELECT channel AS name, role, webhookID, webhookToken FROM channels`
	);
	const rows = statement.all();

	const result: IChannelData[] = [];
	for (const row of rows) {
		result.push({
			name: row.name,
			role: row.role,
			webhookID: row.webhookID,
			webhookToken: row.webhookToken
		});
	}

	return result;
}

export function updateChannelRowWithWebhook(
	channelName: string,
	webhookID: string,
	webhookToken: string
): void {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`UPDATE channels SET webhookID = (?), webhookToken = (?) WHERE channel = (?)`
	);
	statement.run(webhookID, webhookToken, channelName);
}

export function isPersonThemed(username: string): boolean {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`SELECT count(*) as num FROM themedPeople where person = (?)`
	);
	const count = statement.get(username).num;
	return count >= 1;
}

export function themePerson(username: string): void {
	if (isPersonThemed(username)) {
		return;
	}

	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`INSERT INTO themedPeople (person) VALUES (?)`
	);
	statement.run(username);
}

export function unthemePerson(username: string): void {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(`DELETE FROM themedPeople WHERE person = (?)`);
	statement.run(username);
}

export function isPersonSpoofable(username: string): boolean {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`SELECT nospoof FROM userPreferences WHERE person = (?)`
	);
	const results = statement.all(username);
	if (results.length < 1) { return true; }

	return !results[0].nospoof;
}

export function disallowSpoof(username: string): void {
	setSpoofDisallowedSetting(username, 1);
}

export function allowSpoof(username: string): void {
	setSpoofDisallowedSetting(username, 0);
}

function setSpoofDisallowedSetting(username: string, nospoofVal: number): void {
	const db = new sqlite(publicConfig.channelFile);
	const statement = db.prepare(
		`INSERT INTO userPreferences(person, nospoof) VALUES((?), 1) ON CONFLICT(person) DO UPDATE SET nospoof = ${nospoofVal}`
	);

	statement.run(username);
}
