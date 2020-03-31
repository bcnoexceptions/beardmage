
import * as Discord from "discord.js";
import { notifyAuthorOfFailure } from "../util";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {
    let rollRequest: DieRollRequest;
    try {
        rollRequest = parseInput(message.content);
    }
    catch {
        let failMessage: string = "Invalid format. !roll XdY <optional [+-]Z> <optional label>.\n";
        failMessage += "Maximum of 50 dice. 1d100 is the largest die size available, and you can't add or subtract more than 999";
        notifyAuthorOfFailure(message, failMessage);
        return;
    }

    let dieRollStr = "";
    let sum=0;
    
    for (let i: number = 0; i < rollRequest.numDice; ++i ){
        const result = rollDie(rollRequest.numDieSides);
        sum = sum + result
        if (dieRollStr !== "") {
            dieRollStr = dieRollStr + ", " + result.toString();
        }
        else {
            dieRollStr = result.toString();
        }
    }
    if (rollRequest.modifier && rollRequest.modifierOperand) {
        if (rollRequest.modifierOperand === Operand.Add) {
            sum += rollRequest.modifier;
        }
        else {
            sum -= rollRequest.modifier;
        }
    }

    const resultMessage: string = constructChannelMessage(rollRequest, dieRollStr, sum);
    tryToPostInSameChannel(message,resultMessage,getUserName(message.member),null);
}

function constructChannelMessage(rollRequest: DieRollRequest, dieRollStr: string, sum:number): string {
    let resultMessage = "";
    if (rollRequest.label) {
        resultMessage = `${rollRequest.label}\n`;
    }
    resultMessage += `Rolling ${rollRequest.numDice}d${rollRequest.numDieSides}`;
    if (rollRequest.modifierOperand) {
        resultMessage += `${rollRequest.modifierOperand}${rollRequest.modifier}`;
    }

    resultMessage += `\n${dieRollStr}`;
    if (rollRequest.modifier || rollRequest.numDice > 1) {
        resultMessage += ` (total: ${sum})`;
    }
    return resultMessage; 
}

//aka Mr. Sticky learns to regex 
//Accepts commands in the format !roll 1d6+-modifier labeltext, where modifier and labeltext are optional
function parseInput(commandText: string): DieRollRequest {

    const rollInfo: RegExpMatchArray | null = commandText.match(/(!roll)\s+(\d+)\s*[Dd]\s*(\d+)\s*(([+-])\s*(\d+)){0,1}(.*)/)

    if (!rollInfo) {
        throw new Error();
    }

    const numDice = new Number(rollInfo[2]).valueOf();
    const numDieSides = new Number(rollInfo[3]).valueOf();

    let operand: Operand | undefined = undefined;
    let modifier: number | undefined = undefined;
    switch (rollInfo[5]) {
        case ("+"):
            operand=Operand.Add;
            break;
        case "-":
            operand=Operand.Subtract;
            break;
        default:
            break;
    }
    if (operand) {
        modifier = new Number(rollInfo[6]).valueOf();
    }
    if (!isNumInRangeAndValid(numDice,1,50) || !isNumInRangeAndValid(numDieSides,1,100) || (modifier && !isNumInRangeAndValid(modifier,0,999))) {
        throw new Error();
    }

    const label: string | undefined = rollInfo[7].trim();

    return { numDice:numDice, numDieSides: numDieSides, modifierOperand:operand, modifier:modifier, label:label }
}


function rollDie(numSides: number): number {
    return Math.floor(Math.random() * Math.floor(numSides)) + 1;
}

function isNumInRangeAndValid(value: number, start: number, end: number): boolean {
    if (isNaN(value)) {
        return false;
    }
    return (value >= start && value <= end);
}


interface DieRollRequest {
    numDice: number,
    numDieSides: number,
    modifierOperand?: Operand,
    modifier?: number,
    label?: string
}

enum Operand {
    Add = "+",
    Subtract = "-"
}

// uncomment to support !help
process.help = "!roll XdY[+-]Z <optional label>. Message is a descriptor for the roll - e.g. !roll 2d6+3 Attack or !roll 1d12";

// get rid of this - you want your command to be enabled!
process.disabled = false;
