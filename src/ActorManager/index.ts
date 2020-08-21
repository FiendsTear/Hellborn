// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
import Enemy from './Enemy';
import Projectile from './Projectile';
import Player from './Player';
import Spawner from './Spawner';
import { Weapon } from './Player/Weapon';
import { IResourceDictionary } from 'pixi.js';
import Input from '../Input';
import StageManager from '../StageManager';

export default class ActorManager {

	player: Player;
	
	constructor(private stageManager: StageManager, private resources: IResourceDictionary, private input: Input) {
	}

	addActor(kind: string, x: number, y: number, directon?: number, spawner?: Spawner|Weapon) {
		let actor;
		switch(kind) {
		case 'enemy':
			actor = new Enemy(this.stageManager.ground, this.resources);
			actor.id = kind + Object.keys(this.stageManager.ground.enemies).length;
			this.stageManager.ground.enemies[actor.id] = actor;
			break;
		case 'player':
			actor = new Player(this.stageManager.ground, this.resources, this.input, this);
			this.player = actor;
			this.stageManager.ground.player = actor;
			break;
		case 'projectile':
			actor = new Projectile(spawner as Weapon, directon, (spawner as Weapon).owner, this.resources);
			actor.id = kind + Object.keys(this.stageManager.ground.projectiles).length;
			this.stageManager.ground.projectiles[actor.id] = actor;
			break;
		case 'spawner':
			actor = new Spawner(this.stageManager.ground, this.resources);
			actor.id = kind + Object.keys(this.stageManager.ground.spawners).length;
			this.stageManager.ground.spawners[actor.id] = actor;
			break;
		}

		actor.x = x;
		actor.y = y;
		actor.destination.x = x;
		actor.destination.y = y;

		const quadrant = this.stageManager.ground.getQuadrantByCoords(x, y);
		actor.status.quadrants.push(quadrant);

		const quadrantToAddActorTo = actor.status.quadrants[0];
		this.stageManager.ground.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor);
		this.stageManager.ground.addChild(actor);
	}

	removeActor(actor: Actor) {
		this.stageManager.ground.removeChild(actor);
		switch(actor.kind) {
		case 'enemy':
			delete this.stageManager.ground.enemies[actor.id];
			if (Object.keys(this.stageManager.ground.enemies).length === this.stageManager.killCountGoal && Object.keys(this.stageManager.ground.enemies).length === 0) {
				this.stageManager.finishMission();
			}
			break;
		case 'player':
			delete this.stageManager.ground.player;
			break;
		case 'projectile':
			delete this.stageManager.ground.projectiles[actor.id];
			break;
		case 'spawner':
			delete this.stageManager.ground.spawners[actor.id];
			break;
		}
		for (let i = 0, quadrantCount = actor.status.quadrants.length; i < quadrantCount; i++) {
			const quadrant = actor.status.quadrants[i];
			quadrant.activeActors.splice(quadrant.activeActors.indexOf(actor), 1);
		}
	}

	prepareActors(elapsedMS: number) {
		this.stageManager.ground.player.prepare(elapsedMS);

		for (const enemyID in this.stageManager.ground.enemies) {
			this.stageManager.ground.enemies[enemyID].prepare(elapsedMS);
		}
		for (const projectileID in this.stageManager.ground.projectiles) {
			this.stageManager.ground.projectiles[projectileID].prepare(elapsedMS);
		}
		for (const spawnerID in this.stageManager.ground.spawners) {
			this.stageManager.ground.spawners[spawnerID].prepare(elapsedMS);
		}
	}

	updateActors() {
		this.stageManager.ground.player.act();
		if (Object.keys(this.stageManager.ground.spawners).length === 0 &&
			Object.keys(this.stageManager.ground.enemies).length === 0) {
				this.stageManager.finishMission();
			}
		for (const spawnerID in this.stageManager.ground.spawners) {
			const spawner = this.stageManager.ground.spawners[spawnerID];
			if (spawner.status.alive) {
				if (spawner.spawnCooldown <= 0) {
					this.addActor('enemy', spawner.x, spawner.y);
					spawner.act();
				}
			}
			else {
				this.removeActor(spawner);
			}
		}
		for (const enemyID in this.stageManager.ground.enemies) {
			const enemy = this.stageManager.ground.enemies[enemyID]; 
			if (enemy.status.alive) {
				enemy.act();
			}
			else {
				this.removeActor(enemy);
				this.stageManager.ground.player.changeCurrencyAmount(10);
			}
		}
		for (const projectileID in this.stageManager.ground.projectiles) {
			const projectile = this.stageManager.ground.projectiles[projectileID]; 
			if (projectile.status.alive) {
				projectile.act();
			}
			else {
				this.removeActor(projectile);
			}
		}
	}
}