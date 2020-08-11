import * as Discord from "discord.js";
import { getFromUrl } from "../http";
import { notifyAuthorOfFailure } from "../util";

const NPR_FEED_BASE_URL = "https://feeds.npr.org/";
const FEED_FILE_NAME = "/feed.json";
const DEFUALT_FEED = 1001

export default function process(message: Discord.Message): void {
    getFromUrl(getFeedUrl(DEFUALT_FEED)).then((data) => {
        try {
          const feed = JSON.parse(data);
          message.channel.send(getMessage(feed));
        } catch (e) {
          notifyAuthorOfFailure(message, e.message);
        }
    }).catch((reason) => {
      notifyAuthorOfFailure(message, reason);
    });
}

function getMessage(feed: any): string {
    const articleIndex = Math.floor(Math.random() * feed.items.length);
    const article = feed.items[articleIndex];

    return `${article.title} ${article.url}`;
}

function getFeedUrl(feedId: number): string {
  return `${NPR_FEED_BASE_URL}${feedId}${FEED_FILE_NAME}`;
}

process.help = "Get the latest news from NPR";
