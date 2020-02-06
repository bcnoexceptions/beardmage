import * as Discord from "discord.js";
import { IStringMap } from "./util";

export class UserManager {
    private static Instance: UserManager | null = null;

    private knownUsers: IStringMap<Discord.GuildMember>;
    private constructor() {
        this.knownUsers = {};
    }

    public static getInstance(): UserManager {
        if (!UserManager.Instance) {
            UserManager.Instance = new UserManager();
        }

        return UserManager.Instance;
    }

    public async loadUsers(server: Discord.Guild) {
        const fullGuild = await server.fetchMembers();
        const users = fullGuild.members.array();
        for (const user of users) {
            this.addUser(user);
        }
    }

    public addUser(user: Discord.GuildMember) {
        const name = getUserName(user);
        this.knownUsers[name.toUpperCase()] = user;
    }

    public renameUser(
        oldUser: Discord.GuildMember,
        newUser: Discord.GuildMember
    ) {
        delete this.knownUsers[getUserName(oldUser).toUpperCase()];
        this.addUser(newUser);
    }

    public lookupUser(name: string): Discord.GuildMember | null {
        if (this.knownUsers[name.toUpperCase()]) {
            return this.knownUsers[name.toUpperCase()];
        }

        if (name.startsWith("<@")) {
            let id: string;
            if (name[2] === "!") {
                id = name.slice("<@!".length, -1);
            } else {
                id = name.slice("<@".length, -1);
            }

            for (const userName of Object.keys(this.knownUsers)) {
                if (this.knownUsers[userName].id === id) {
                    return this.knownUsers[userName];
                }
            }
        }

        return null;
    }

    public logUsers() {
        for (const name of Object.keys(this.knownUsers)) {
            console.log(getUserName(this.knownUsers[name]));
        }
    }
}

export function getUserName(user: Discord.GuildMember) {
    let name = user.nickname;
    if (!name) {
        name = user.user.username;
    }
    return name;
}
