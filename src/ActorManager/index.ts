// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
import Enemy from './Enemy';
import Projectile from './Projectile';
import Player from './Player';
import Spawner from './Spawner';
import { Weapon } from './Player/Weapon';

export interface Actors {
	[id: string]: Actor;
}

export default class ActorManager {
	actors: Actors;
	enemiesCount: number;
	enemiesAlive: number;
	playersCount: number;
	projectilesCount: number;
	spawnerCount: number;
	player: Player;
	
	constructor(private engine: Engine) {
		this.actors = {};
		this.enemiesCount = 0;
		this.enemiesAlive = 0;
		this.playersCount = 0;
		this.projectilesCount = 0;
		this.spawnerCount = 0;
	}

	addActor(kind: string, x: number, y: number, directon?: number, spawner?: Spawner|Weapon) {
		let actor;
		switch(kind) {
		case 'enemy':
			actor = new Enemy(this.engine);
			this.enemiesCount = this.enemiesCount + 1;
			actor.id = kind + this.enemiesCount;
			this.enemiesAlive = this.enemiesAlive + 1;
			break;
		case 'player':
			actor = new Player(this.engine);
			this.player = actor;
			this.playersCount = this.playersCount + 1;
			actor.id = kind + this.playersCount;
			break;
		case 'projectile':
			actor = new Projectile(spawner as Weapon, directon, (spawner as Weapon).owner);
			this.projectilesCount = this.projectilesCount + 1;
			actor.id = kind + this.projectilesCount;
			break;
		case 'spawner':
			actor = new Spawner(this.engine);
			this.spawnerCount = this.spawnerCount + 1;
			actor.id = kind + this.spawnerCount;
			break;
		}
		this.actors[actor.id] = actor;

		actor.x = x;
		actor.y = y;
		actor.destination.x = x;
		actor.destination.y = y;

		const quadrant = this.engine.missionManager.ground.getQuadrantByCoords(x, y);
		actor.status.quadrants.push(quadrant);

		const quadrantToAddActorTo = actor.status.quadrants[0];
		this.engine.missionManager.ground.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor.id);
		this.engine.missionManager.ground.addChild(actor);
	}

	removeActor(actor: Actor) {
		if (actor.kind === 'enemy') {
			this.enemiesAlive = this.enemiesAlive - 1;
		}
		this.engine.missionManager.ground.removeChild(actor);
		for (let i = 0, quadrantCount = actor.status.quadrants.length; i < quadrantCount; i++) {
			const quadrant = actor.status.quadrants[i];
			quadrant.activeActors.splice(quadrant.activeActors.indexOf(actor.id), 1);
		}
		delete this.actors[actor.id];
		if (this.enemiesCount === this.engine.missionManager.killCountGoal && this.enemiesAlive === 0) {
			this.engine.missionManager.finishMission();
		}
	}

	prepareActors() {
		for (const actorID in this.actors) {
			if (this.actors[actorID].status.alive) {
				this.actors[actorID].prepare();
			}
		}
	}

	updateActors() {
		for (const actorID in this.actors) {
			if (this.actors[actorID].status.alive) {
				this.actors[actorID].act();
			}
		}
	}
}