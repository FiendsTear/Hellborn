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

	constructor(engine: Engine) {
		const kind = 'spawner';
		super(engine, kind);

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
			this.engine.actorManager.addActor('enemy', this.x, this.y);
			this.spawnCooldown = 4000;
		}
	}
}