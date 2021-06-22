import * as Discord from "discord.js";
import * as google from "@google-cloud/language";
import { exec } from "child_process";
import { IBotTrigger } from "../contextualResponses";

type IDocument = google.protos.google.cloud.language.v1.IDocument;
type IEntity = google.protos.google.cloud.language.v1.IEntity;
type IFeatures = google.protos.google.cloud.language.v1.AnnotateTextRequest.IFeatures;

const Pronouns = [
	"i",
	"you",
	"me",
	"him",
	"her",
	"them",
	"us",
	"we",
	"it",
	"he",
	"she",
	"they",
	"myself",
	"yourself",
	"himself",
	"herself",
	"themselves",
];

const FREQUENCY = 0.005; // 1 per 200 messages

export class UrMom implements IBotTrigger {
	public doesMessageApply(message: Discord.Message): boolean {
		return Math.random() < FREQUENCY;
	}

	public react(message: Discord.Message): void {
		this.__callOnSJ(message);
	}

	private async __callOnSJ(message: Discord.Message): Promise<void> {
		const text = await getMomString(message.content);
		if (text) {
			message.channel.send(text);
		}
	}
}

export async function getMomString(text: string): Promise<string> {
	process.env["GOOGLE_APPLICATION_CREDENTIALS"] =
		"src/config/google-key.json";
	const client = new google.LanguageServiceClient();

	const document: IDocument = { content: text, type: "PLAIN_TEXT" };
	const features: IFeatures = {
		extractEntitySentiment: true,
		extractSyntax: true,
	};

	const [response] = await client.annotateText({
		document: document,
		features: features,
	});

	let mostSalient = getMostSalientEntity(response);

	let mostSalIndex = -1;
	if (mostSalient) {
		mostSalIndex = text.indexOf(mostSalient!.name!);
	}

	const mostSalVerb = getMostSalientVerb(response, mostSalIndex);

	let pastTense: string = "";
	if (mostSalVerb) {
		pastTense = await makePastTense(mostSalVerb);
	}

	if (mostSalient && pastTense) {
		const noun = mostSalient.name;
		return `I ${pastTense} your mom's ${noun} last night, nawmean?`;
	}

	return "";
}

type IResponse = google.protos.google.cloud.language.v1.IAnnotateTextResponse;

function getMostSalientEntity(response: IResponse): IEntity | null {
	let mostSalient: IEntity | null = null;
	let highestSalVal: number = -99999;

	for (const entity of response.entities!) {
		const name = entity.name!;
		if (Pronouns.indexOf(name) >= 0) {
			continue; // skip pronouns
		}

		if (highestSalVal < entity.salience!) {
			highestSalVal = entity.salience!;
			mostSalient = entity;
		}
	}

	return mostSalient;
}

function getMostSalientVerb(response: IResponse, entityIndex: number): string {
	if (entityIndex < 0) {
		return "";
	}

	let mostSalVerb: string = "";

	for (const token of response.tokens!) {
		if (token.text!.beginOffset! > entityIndex) {
			return ""; // gone too far without finding a verb
		}

		if (token.partOfSpeech!.tag === "VERB") {
			mostSalVerb = token.lemma!;
		}
	}

	return mostSalVerb;
}

async function makePastTense(text: string): Promise<string> {
	const promise = new Promise<string>((resolve) => {
		const stream = exec("./tensify.py", (_errMsg, stdout, _stderr) => {
			resolve(stdout.trim());
		});

		stream.stdin?.write(text);
		stream.stdin?.end();
	});

	return promise;
}
