import * as Discord from "discord.js";
import * as fs from "fs";

export async function sendWelcomeToUser(user: Discord.User): Promise<boolean> {
 
    const path = "./data/welcome.txt";
    const fileBuffer: Buffer = await fs.promises.readFile(path);

    const messageData = fileBuffer.toString("utf8");

    if (messageData) {
        user.send(messageData);
        return true;
    }
    else {
        return false;
    }
}