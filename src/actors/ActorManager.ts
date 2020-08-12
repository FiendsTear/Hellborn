// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';

export interface Actors {
	[id: string]: Actor;
}

export default class ActorManager {
	engine: Engine;
	actors: Actors;
	enemiesCount: number;
	enemiesAlive: number;
	playersCount: number;
	projectilesCount: number;
	spawnerCount: number;
	
	constructor(engine: Engine) {
		this.engine = engine;
		this.actors = {};
		this.enemiesCount = 0;
		this.enemiesAlive = 0;
		this.playersCount = 0;
		this.projectilesCount = 0;
		this.spawnerCount = 0;
	}

	addActor(actor: Actor) {
		if (!this.actors[actor.id]) {
			actor.id = actor.kind;
			switch(actor.kind) {
			case 'enemy':
				this.enemiesCount = this.enemiesCount + 1;
				actor.id = actor.id + this.enemiesCount;
				this.enemiesAlive = this.enemiesAlive + 1;
				break;
			case 'player':
				this.playersCount = this.playersCount + 1;
				actor.id = actor.id + this.playersCount;
				break;
			case 'projectile':
				this.projectilesCount = this.projectilesCount + 1;
				actor.id = actor.id + this.projectilesCount;
				break;
			case 'spawner':
				this.spawnerCount = this.spawnerCount + 1;
				actor.id = actor.id + this.spawnerCount;
				break;
			}
			this.actors[actor.id] = actor;
			const quadrantToAddActorTo = actor.status.quadrants[0];
			this.engine.grid.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor.id);
			actor.ground.addChild(actor);
		}
	}

	removeActor(actor: Actor) {
		if (actor.kind === 'enemy') {
			this.enemiesAlive = this.enemiesAlive - 1;
		}
		actor.ground.removeChild(actor);
		for (let i = 0, quadrantCount = actor.status.quadrants.length; i < quadrantCount; i++) {
			const quadrant = actor.status.quadrants[i];
			quadrant.activeActors.splice(quadrant.activeActors.indexOf(actor.id), 1);
		}
		delete this.actors[actor.id];
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