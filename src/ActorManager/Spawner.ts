// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';

export default class Spawner extends Actor {
	spawnCooldown: number;

	constructor(engine: Engine) {
		super(engine, 'spawner');

		this.spawnCooldown = 0;
		this.act = this.act.bind(this);
	}
	
	prepare() {
		if (this.spawnCooldown > 0) {
			this.spawnCooldown = this.spawnCooldown - this.engine.ticker.elapsedMS;
		}
	}

	act(): void {
		if (this.spawnCooldown <= 0 && this.engine.actorManager.enemiesCount < this.engine.missionManager.killCountGoal ) {
			this.engine.actorManager.addActor('enemy', this.x, this.y);
			this.spawnCooldown = 4000;
		}
	}
}