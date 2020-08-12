// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import {Quadrant} from '../physics/Grid';
import Enemy from './Enemy';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';

export default class Spawner extends Actor {
	spawnCooldown: number;
	spawnTexture: PIXI.Texture;

	constructor(ground: Ground, texture: PIXI.Texture, engine: Engine, quadrant: Quadrant) {
		const kind = 'spawner';
		super(engine, kind, ground, quadrant);

		this.spawnTexture = texture;
		this.spawnCooldown = 0;
		this.act = this.act.bind(this);
	}
	
	prepare() {
		if (this.spawnCooldown > 0) {
			this.spawnCooldown = this.spawnCooldown - this.engine.ticker.elapsedMS;
		}
	}

	act(): void {
		if (this.spawnCooldown <= 0 && this.engine.actorManager.enemiesCount < 10 ) {
			const enemy = new Enemy(this.ground, this.spawnTexture, this.engine, this.status.quadrants[0]);
			this.engine.actorManager.addActor(enemy);
			this.spawnCooldown = 4000;
		}
	}
}