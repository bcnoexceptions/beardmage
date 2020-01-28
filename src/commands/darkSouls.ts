import * as Discord from "discord.js";
import { tryToPostInSameChannel } from "../channels";
import { getUserName } from "../knownUsers";

export default function process(message: Discord.Message): void {
	const result: string = message.author.username + " reads a message scrawled on the ground: " + generateDarkSoulsSaying();
	tryToPostInSameChannel(message, result, "beardslave", "Can't spoof on this channel");
}

export function generateDarkSoulsSaying(): string {
	let saying: string = "";

	let base: string = "";  //Get from DB

	if (base.indexOf("****") !== -1) {
		let fill: string = "";  //Get from DB
		if (base.indexOf(":") === -1 && base.indexOf("****") !== 0) {  //No colon and fill is not the start
			fill = fill.toLowerCase();
		}
		saying = base.replace("****", fill);
	} else {
		saying = base;
	}

	//Send the saying
	//return saying;
	return "Praise the Sun!";
}

// uncomment to support !help
process.help = "!darksouls Says a dark souls message";

/* s ^XDarkSouls("Base",1)="**** ahead"
  8     s ^XDarkSouls("Base",2)="Be wary of ****"
  9     s ^XDarkSouls("Base",3)="Try ****"
 10     s ^XDarkSouls("Base",4)="Need ****"
 11     s ^XDarkSouls("Base",5)="Imminent ****"
 12     s ^XDarkSouls("Base",6)="Weakness: ****"
 13     s ^XDarkSouls("Base",7)="****"
 14     s ^XDarkSouls("Base",8)="****?"
 15     s ^XDarkSouls("Base",9)="Praise the Sun!"
*/

/*"Enemy,Tough enemy,Hollow,Soldier,Knight,Sniper,Caster,Giant,Skeleton,Ghost,Bug,Poison bug,Lizard,Drake,Flier,Golem,Statue,
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
