// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
import Ground from '../../StageManager/Ground';
import { IResourceDictionary } from 'pixi.js';

export default class Spawner extends Actor {
	spawnCooldown: number;
	spawnedActorsCount: number;
	spawnLimit: number;

	constructor(ground: Ground, resources: IResourceDictionary) {
		super(ground, resources, 'spawner');

		this.spawnCooldown = 0;
		this.spawnedActorsCount = 0;
		this.spawnLimit = 1;

		this.act = this.act.bind(this);
	}
	
	prepare(elapsedMS: number) {
		if (this.spawnCooldown > 0) {
			this.spawnCooldown = this.spawnCooldown - elapsedMS;
		}
	}

	act(): void {
		this.spawnCooldown = 4000;
		this.spawnedActorsCount = this.spawnedActorsCount + 1;
		if (this.spawnedActorsCount >= this.spawnLimit) {
			this.die();
		}
	}
}