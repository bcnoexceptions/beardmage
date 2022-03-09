import * as Discord from "discord.js";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";

/*s ^XDarkSouls("Base",1)="**** ahead"
s ^XDarkSouls("Base",2)="Be wary of ****"
s ^XDarkSouls("Base",3)="Try ****"
s ^XDarkSouls("Base",4)="Need ****"
s ^XDarkSouls("Base",5)="Imminent ****"
s ^XDarkSouls("Base",6)="Weakness: ****"
s ^XDarkSouls("Base",7)="****"
s ^XDarkSouls("Base",8)="****?"
s ^XDarkSouls("Base",9)="Praise the Sun!"


"Enemy,Tough enemy,Hollow,Soldier,Knight,Sniper,Caster,Giant,Skeleton,Ghost,Bug,Poison bug,Lizard,Drake,Flier,Golem,Statue,
Monster,Strange creature,Demon,Darkwraith,Dragon,Boss,Saint,Wretch,Charmer,Miscreant,Liar,Fatty,Beanpole,Merchant,Blacksmith,
Master,Prisoner,Bonfire,Fog wall,Humanity,Lever,Switch,Key,Treasure,Chest,Weapon,Shield,Projectile,Armour,Item,Ring,Sorcery scroll,
Pyromancy scroll,Miracle scroll,Ember,Trap,Covenant,Amazing key,Amazing treasure,Amazing chest,Amazing weapon,Amazing shield,Amazing projectile,
Amazing armour,Amazing item,Amazing ring,Amazing sorcery scroll,Amazing pyromancy scroll,Amazing miracle scroll,Amazing ember,
Amazing trap,Close-ranged battle,Ranged battle,Eliminating one at a time,Luring it out,Beating to a pulp,Lying in ambush,Stealth,Mimicry,
Pincer attack,Hitting them in one swoop,Fleeing,Charging,Stabbing in the back,Sweeping attack,Shield breaking,Head shots,Sorcery,Pyromancy,
Miracles,Jumping off,Sliding down,Dashing through,Rolling,Backstepping,Jumping,Attacking,Holding with both hands,Kicking,A plunging attack,
Blocking,Parrying,Locking on,Path,Hidden path,Shortcut,Detour,Illusionary wall,Shortcut,Dead end,Swamp,Lava,Forest,Cave,Labyrinth,Safe zone,
Danger zone,Sniper spot,Bright spot,Dark spot,Open area,Tight spot,Hidden place,Exchange,Gorgeous view,Fall,Front,Back,Left,Right,Up,Down,
Feet,Head,Neck,Stomach,Back,Arm,Leg,Heel,Rear,Tail,Wings,Anywhere,Strike,Thrust,Slash,Magic,Fire,Lightning,Critical hits,Bleeding,
Poison,Strong poison,Curses,Divine,Occult,Crystal,Chance,Hint,Secret,Happiness,Sorrow,Life,Death,Undead,Elation,Grief,Hope,Despair,Light,Dark,Bravery,Resignation,Comfort,Tears"*/

export default function process(message: Discord.Message): void {
    const result: string =
        "*" +
        getUserName(message.member) +
        " reads a message scrawled on the ground:* " +
        generateDarkSoulsSaying();
    
    message.channel.send(result);
}

export function generateDarkSoulsSaying(): string {
    const mode = Math.floor(Math.random() * 2) + 1;
	
	let baseSayings: string[];
	let fillSayings: string[];
	
	if (mode === 1)
	{
		return generatePhrase(getDS1Bases(), getDS1Fills());
	}
	else
	{
		const firstPhrase = generatePhrase(getDS2Bases(), getDS2Fills());
		if (Math.floor(Math.random() * 2) === 0) {
			return firstPhrase;
		}
		const conjunctions = getConjunctions();
		let conj = conjunctions[Math.floor(Math.random() * conjunctions.length)];
		const lastChar = firstPhrase.charAt(firstPhrase.length - 1);
		if (lastChar === '!' || lastChar === '?') {
			if (conj === ",") {
				conj = "";
			} else {
				const firstChar = conj.charAt(1);  //First char is actually a space, so get the 2nd character for the "first character"
				conj = ' ' + firstChar.toUpperCase() + conj.substring(2, conj.length - 1);
			}
		}
		return firstPhrase + conj + generatePhrase(getDS2Bases(), getDS2Fills(), true);
	}
	
	return "RRRRIP fucked up somewhere";  //Should never hit this since there's an if-else, both with returns
}

export function generatePhrase(bases: string[], fills: string[], lowercase: Boolean = false): string {
	let base: string = bases[Math.floor(Math.random() * bases.length)];
	let fill: string;
	let phrase: string;
	
	if (base.indexOf("****") !== -1) {
		fill = fills[Math.floor(Math.random() * fills.length)];
		const lastChar = fill.charAt(fill.length - 1);
		if (lastChar === '!' || lastChar === '?') {
			base = "****";
		}
		if (base.indexOf(":") === -1 && base.indexOf("****") !== 0) {
			fill = fill.toLowerCase();
		}
		phrase = base.replace("****", fill);
	} else {
		phrase = base;
	}
	
	return phrase;
}
	

export function getDS1Fills(): string[] {
    return [
        "Enemy",
        "Tough enemy",
        "Hollow",
        "Soldier",
        "Knight",
        "Sniper",
        "Caster",
        "Giant",
        "Skeleton",
        "Ghost",
        "Bug",
        "Poison bug",
        "Lizard",
        "Drake",
        "Flier",
        "Golem",
        "Statue",
        "Monster",
        "Strange creature",
        "Demon",
        "Darkwraith",
        "Dragon",
        "Boss",
        "Saint",
        "Wretch",
        "Charmer",
        "Miscreant",
        "Liar",
        "Fatty",
        "Beanpole",
        "Merchant",
        "Blacksmith",
        "Master",
        "Prisoner",
        "Bonfire",
        "Fog wall",
        "Humanity",
        "Lever",
        "Switch",
        "Key",
        "Treasure",
        "Chest",
        "Weapon",
        "Shield",
        "Projectile",
        "Armour",
        "Item",
        "Ring",
        "Sorcery scroll",
        "Pyromancy scroll",
        "Miracle scroll",
        "Ember",
        "Trap",
        "Covenant",
        "Amazing key",
        "Amazing treasure",
        "Amazing chest",
        "Amazing weapon",
        "Amazing shield",
        "Amazing projectile",
        "Amazing armour",
        "Amazing item",
        "Amazing ring",
        "Amazing sorcery scroll",
        "Amazing pyromancy scroll",
        "Amazing miracle scroll",
        "Amazing ember",
        "Amazing trap",
        "Close - ranged battle",
        "Ranged battle",
        "Eliminating one at a time",
        "Luring it out",
        "Beating to a pulp",
        "Lying in ambush",
        "Stealth",
        "Mimicry",
        "Pincer attack",
        "Hitting them in one swoop",
        "Fleeing",
        "Charging",
        "Stabbing in the back",
        "Sweeping attack",
        "Shield breaking",
        "Head shots",
        "Sorcery",
        "Pyromancy",
        "Miracles",
        "Jumping off",
        "Sliding down",
        "Dashing through",
        "Rolling",
        "Backstepping",
        "Jumping",
        "Attacking",
        "Holding with both hands",
        "Kicking",
        "A plunging attack",
        "Blocking",
        "Parrying",
        "Locking on",
        "Path",
        "Hidden path",
        "Shortcut",
        "Detour",
        "Illusionary wall",
        "Shortcut",
        "Dead end",
        "Swamp",
        "Lava",
        "Forest",
        "Cave",
        "Labyrinth",
        "Safe zone",
        "Danger zone",
        "Sniper spot",
        "Bright spot",
        "Dark spot",
        "Open area",
        "Tight spot",
        "Hidden place",
        "Exchange",
        "Gorgeous view",
        "Fall",
        "Front",
        "Back",
        "Left",
        "Right",
        "Up",
        "Down",
        "Feet",
        "Head",
        "Neck",
        "Stomach",
        "Back",
        "Arm",
        "Leg",
        "Heel",
        "Rear",
        "Tail",
        "Wings",
        "Anywhere",
        "Strike",
        "Thrust",
        "Slash",
        "Magic",
        "Fire",
        "Lightning",
        "Critical hits",
        "Bleeding",
        "Poison",
        "Strong poison",
        "Curses",
        "Divine",
        "Occult",
        "Crystal",
        "Chance",
        "Hint",
        "Secret",
        "Happiness",
        "Sorrow",
        "Life",
        "Death",
        "Undead",
        "Elation",
        "Grief",
        "Hope",
        "Despair",
        "Light",
        "Dark",
        "Bravery",
        "Resignation",
        "Comfort",
        "Tears"
    ];
}

export function getDS2Fills(): string[] {
	return [
		"Enemy",
		"Monster",
		"Mob enemy",
        "Tough enemy",
        "Critical foe",
        "Hollow",
        "Pilgrim",
        "Prisoner",
        "Monstrosity",
        "Skeleton",
        "Ghost",
        "Beast",
        "Lizard",
        "Bug",
        "Grub",
        "Crab",
        "Dwarf",
        "Giant",
        "Demon",
        "Dragon",
        "Knight",
        "Sellsword",
        "Warrior",
        "Herald",
        "Bandit",
        "Assassin",
        "Sorcerer",
        "Pyromancer",
        "Cleric",
		"Deprived",
		"Sniper",
		"Duo",
		"Trio",
		"You",
		"You bastard",
		"Good fellow",
		"Saint",
		"Wretch",
		"Charmer",
		"Poor soul",
		"Oddball",
		"Nimble one",
		"Laggard",
		"Moneybags",
		"Beggar",
		"Miscreant",
		"Liar",
		"Fatty",
		"Beanpole",
		"Youth",
		"Elder",
		"Old codger",
		"Old dear",
		"Merchant",
		"Artisan",
		"Master",
		"Sage",
		"Champion",
		"Lord of Cinder",
		"King",
		"Queen",
		"Prince",
		"Princess",
		"Angel",
		"God",
		"Friend",
		"Ally",
		"Spouse",
		"Covenantor",
		"Phantom",
		"Dark Spirit",
		"Bonfire",
		"Ember",
		"Fog wall",
		"Lever",
		"Contraption",
		"Key",
		"Trap",
		"Torch",
		"Door",
		"Treasure",
		"Chest",
		"Something",
		"Quite something",
		"Rubbish",
		"Filth",
		"Weapon",
		"Shield",
		"Projectile",
		"Armor",
		"Item",
		"Ring",
		"Ore",
		"Coal",
		"Transposing kiln",
		"Scroll",
		"Umbral ash",
		"Throne",
		"Rite",
		"Coffin",
		"Cinder",
		"Ash",
		"Moon",
		"Eye",
		"Brew",
		"Soup",
		"Message",
		"Bloodstain",
		"Illusion",
		"Close-ranged battle",
		"Ranged battle",
		"Eliminating one at a Time",
		"Luring it out",
		"Beating to a pulp",
		"Ambush",
		"Pincer attack",
		"Hitting them in one swoop",
		"Duel-wielding",
		"Stealth",
		"Mimicry",
		"Fleeing",
		"Charging",
		"Jumping off",
		"Dashing through",
		"Circling around",
		"Trapping inside",
		"Rescue",
		"Skill",
		"Sorcery",
		"Pyromancy",
		"Miracles",
		"Pure luck",
		"Prudence",
		"Brief respite",
		"Play dead",
		"Jog",
		"Dash",
		"Rolling",
		"Backstepping",
		"Jumping",
		"Attacking",
		"Jump attack",
		"Dash attack",
		"Counter attack",
		"Stabbing in the back",
		"Guard stun & stab",
		"Plunging attack",
		"Shield breaking",
		"Blocking",
		"Parrying",
		"Locking-on",
		"No lock-on",
		"Two-handing",
		"Gesture",
		"Control",
		"Destroy",
		"Boulder",
		"Lava",
		"Poison gas",
		"Enemy horde",
		"Forest",
		"Swamp",
		"Cave",
		"Shortcut",
		"Detour",
		"Hidden path",
		"Secret passage",
		"Dead end",
		"Labyrinth",
		"Hole",
		"Bright spot",
		"Dark spot",
		"Open area",
		"Tight spot",
		"Safe zone",
		"Danger zone",
		"Sniper spot",
		"Hiding place",
		"Illusory wall",
		"Ladder",
		"Lift",
		"Gorgeous view",
		"Looking away",
		"Overconfidence",
		"Slip-up",
		"Oversight",
		"Fatigue",
		"Bad luck",
		"Inattention",
		"Loss of stamina",
		"Chance encounter",
		"Planned encounter",
		"Front",
		"Back",
		"Left",
		"Right",
		"Up",
		"Down",
		"Below",
		"Above",
		"Behind",
		"Head",
		"Neck",
		"Stomach",
		"Back",
		"Armor",
		"Finger",
		"Leg",
		"Rear",
		"Tail",
		"Wings",
		"Anywhere",
		"Tongue",
		"Right arm",
		"Left arm",
		"Thumb",
		"Indexfinger",
		"Longfinger",
		"Ringfinger",
		"Smallfinger",
		"Right leg",
		"Left leg",
		"Right side",
		"Left side",
		"Pincer",
		"Wheel",
		"Core",
		"Mount",
		"Regular",
		"Strike",
		"Thrust",
		"Slash",
		"Magic",
		"Crystal",
		"Fire",
		"Chaos",
		"Lightning",
		"Blessing",
		"Dark",
		"Critical hits",
		"Bleeding",
		"Poison",
		"Toxic",
		"Frost",
		"Curse",
		"Equipment breakage",
		"Chance",
		"Quagmire",
		"Hint",
		"Secret",
		"Sleeptalk",
		"Happiness",
		"Misfortune",
		"Life",
		"Death",
		"Demise",
		"Joy",
		"Fury",
		"Agony",
		"Sadness",
		"Tears",
		"Loyalty",
		"Betrayal",
		"Hope",
		"Despair",
		"Fear",
		"Losing sanity",
		"Victory",
		"Defeat",
		"Sacrifice",
		"Light",
		"Dark",
		"Bravery",
		"Confidence",
		"Vigor",
		"Revenge",
		"Resignation",
		"Overwhelming",
		"Regret",
		"Pointless",
		"Man",
		"Woman",
		"Friendship",
		"Love",
		"Recklessness",
		"Composure",
		"Guts",
		"Comfort",
		"Silence",
		"Deep",
		"Dregs",
		"Good luck",
		"Fine work",
		"I did it!",
		"I've failed...",
		"Here!",
		"Not here!",
		"I can't take this...",
		"Lonely...",
		"Don't you dare!",
		"Do it!",
		"Look carefully",
		"Listen carefully",
		"Think carefully",
		"This place again?",
		"Now the real fight begins",
		"You don't deserve this",
		"Keep moving",
		"Pull back",
		"Give it up",
		"Don't give up",
		"Help me...",
		"Impossible...",
		"Bloody expensive...",
		"Let me out of here...",
		"Stay calm",
		"Like a dream...",
		"Seems familiar...",
		"Are you ready?",
		"It'll happen to you too",
		"Praise the Sun!",
		"May the flames guide thee"
	];
}

export function getDS1Bases(): string[] {
	 return [
        "**** ahead",
        "Be wary of ****",
        "Try ****",
        "Need ****",
        "Imminent ****",
        "Weakness: ****",
        "****",
        "****?",
        "Praise the Sun!"
	]
}

export function getDS2Bases(): string[] {
    return [
        "**** ahead",
        "Be wary of ****",
        "Try ****",
        "Need ****",
        "Imminent ****",
        "Weakness: ****",
        "****",
        "****?",
        "Praise the Sun!",
		"**** required ahead",
		"Visions of ****...",
		"****!",
		"****...",
		"Hurrah for ****!",
		"No **** ahead",
		"Could this be a ****?",
		"If only I had a ****....",
		"Time for ****",
		"Huh, it's a ****....",
		"Praise the ****!",
		"Let there be ****",
		"Aah, ****...."
    ];
}

export function getConjunctions(): string [] {
	return [
		" and then",
		" but",
		" therefore",
		" in short",
		" or",
		" only",
		" by the way",
		" so to speak",
		" all the more",
		","
	];
}

// uncomment to support !help
process.help = "Says a dark souls message";

process.disabled = false;
