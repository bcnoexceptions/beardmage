import * as Discord from "discord.js";
import { getFromUrl } from "../http";
import { notifyAuthorOfFailure } from "../util";

const NPR_FEED_BASE_URL = "https://feeds.npr.org/";
const FEED_FILE_NAME = "/feed.json";
const DEFAULT_FEED = 1001;
const NPR_TOPICS_URL = "http://api.npr.org/list?id=3218&output=JSON";
const LIST_CATEGORIES_COMMAND = "categories";

export default async function process(message: Discord.Message): Promise<void> {
    const pieces = message.content.split(/\s+/);

    let feedId = DEFAULT_FEED;
    if (pieces.length > 1) {
        const category = pieces[1];
        if (category.toLowerCase() === LIST_CATEGORIES_COMMAND) {
            await sendCategories(message.author);
            return;
        }

        try {
            feedId = await getFeedForCategory(category);
            if (feedId === -1) {
                await message.author.send(`Invalid category: ${category}`);
                await sendCategories(message.author);
            }
        } catch (e) {
            notifyAuthorOfFailure(message, e.message);
        }
    }

    try {
        const data = await getFromUrl(getFeedUrl(feedId));

        const feed = JSON.parse(data);
        message.channel.send(getMessage(feed));
    } catch (e) {
        notifyAuthorOfFailure(message, e.message);
    }
}

function getMessage(feed: any): string {
    const articleIndex = Math.floor(Math.random() * feed.items.length);
    const article = feed.items[articleIndex];

    return `${article.title} ${article.url}`;
}

function getFeedUrl(feedId: number): string {
    return `${NPR_FEED_BASE_URL}${feedId}${FEED_FILE_NAME}`;
}

async function getFeedForCategory(category: string): Promise<number> {
    const topics = await getTopics();
    const keys = Array.from(topics.keys());
    const matchingKeys = keys.filter((key) =>
        key.toLowerCase().startsWith(category.toLowerCase())
    );

    if (matchingKeys.length > 0) {
        return topics.get(matchingKeys[0]) ?? -1;
    } else {
        return -1;
    }
}

async function sendCategories(user: Discord.User) {
    const topics = await getTopics();
    const keys = Array.from(topics.keys()).sort();
    const message = keys.reduce(
        (prev, curr) => `${prev}\n${curr}`,
        "Available categories for NPR:\n"
    );
    await user.send(message);
}

async function getTopics(): Promise<Map<string, number>> {
    const topicsResult = await getFromUrl(NPR_TOPICS_URL);
    const topics = JSON.parse(topicsResult);
    const topicMap = new Map<string, number>();

    for (let subCategory of topics.subcategory) {
        for (let item of subCategory.item) {
            topicMap.set(item.title.$text, item.id);
        }
    }

    return topicMap;
}

process.help = `Get the latest news from NPR
    !npr - Get a random news article.
    !npr <category> - Get a random news article from a category.
    !npr categories - List available categories.`;
