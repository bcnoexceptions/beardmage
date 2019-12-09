import sqlite from "better-sqlite3";
import * as publicConfig from "./config/public-config.json";
import { IWebhook } from "./webhooks";

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
    const db = new sqlite(publicConfig.channelFile);
    const statement = db.prepare(
        `SELECT webhookID, webhookToken FROM channels WHERE channel = (?)`
    );
    const rows = statement.all(channelName);
    const num = rows.length;

    if (num === 0) {
        return null;
    }

    const ID: string = rows[0].webhookID;
    const token: string = rows[0].webhookToken;

    if (!ID || !token) {
        return null;
    }

    return { ID, token };
}
