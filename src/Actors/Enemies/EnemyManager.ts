import Spawner from './Spawner';
import { IResourceDictionary } from 'pixi.js';
import StageManager from '../../StageManager';
import Actor from '../Actor';
import Wolf from './Wolf';

interface Enemies {
	[id: string]: Actor;
}

interface Spawners {
	[id: string]: Spawner;
}

export default class EnemyManager {
	enemies: Enemies;
	spawners: Spawners;

	constructor(private stageManager: StageManager, private resources: IResourceDictionary) {
		this.enemies = {} as Enemies;
		this.spawners = {} as Spawners;
	}

	addEnemy(kind: string, x: number, y: number) {
		let enemy;
		switch(kind) {
		case 'wolf':
			enemy = new Wolf(this.stageManager.ground, this.resources, this.stageManager.playerActor);
			break;
		}
		enemy.id = 'enemy' + Object.keys(this.enemies).length;
		this.enemies[enemy.id] = enemy;

		enemy.x = x;
		enemy.y = y;
		enemy.destination.x = x;
		enemy.destination.y = y;
		this.stageManager.ground.addActor(enemy);
	}

	addSpawner(x: number, y: number) {
		const spawner = new Spawner(this.stageManager.ground, this.resources);
		spawner.id = 'spawner' + Object.keys(this.spawners).length;
		spawner.x = x;
		spawner.y = y;
		this.spawners[spawner.id] = spawner;
	}

	removeActor(actor: Actor) {
		switch(actor.kind) {
		case 'enemy':
			delete this.enemies[actor.id];
			if (Object.keys(this.enemies).length === this.stageManager.killCountGoal && Object.keys(this.enemies).length === 0) {
				this.stageManager.finishMission();
			}
			break;
		case 'spawner':
			delete this.spawners[actor.id];
			break;
		}
		this.stageManager.ground.removeActor(actor);
	}

	prepare(elapsedMS: number) {
		for (const enemyID in this.enemies) {
			this.enemies[enemyID].prepare(elapsedMS);
		}
		for (const spawnerID in this.spawners) {
			this.spawners[spawnerID].prepare(elapsedMS);
		}
	}

	update() {
		if (Object.keys(this.spawners).length === 0 &&
				Object.keys(this.enemies).length === 0) {
			this.stageManager.finishMission();
		}
		for (const spawnerID in this.spawners) {
			const spawner = this.spawners[spawnerID];
			if (spawner.status.alive) {
				if (spawner.spawnCooldown <= 0) {
					this.addEnemy('wolf', spawner.x, spawner.y);
					spawner.act();
				}
			}
			else {
				this.removeActor(spawner);
			}
		}
		for (const enemyID in this.enemies) {
			const enemy = this.enemies[enemyID]; 
			if (enemy.status.alive) {
				enemy.act();
			}
			else {
				this.removeActor(enemy);
				this.stageManager.playerActor.changeCurrencyAmount(10);
			}
		}
	}
}