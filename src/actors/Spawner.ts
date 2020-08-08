// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import {Quadrant} from '../physics/Grid';
import Enemy from './Enemy';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';

export default class Spawner extends Actor {
	spawnCooldown: number;
	spawnTexture: PIXI.Texture;

	constructor(ground: Ground, texture: PIXI.Texture, state: Game, quadrant: Quadrant) {
		const kind = 'spawner';
		super(state, kind, ground, quadrant);

		this.spawnTexture = texture;
		this.spawnCooldown = 0;
		this.act = this.act.bind(this);
	}
	
	prepare() {
		if (this.spawnCooldown > 0) {
			this.spawnCooldown = this.spawnCooldown - this.state.ticker.elapsedMS;
		}
	}

	act(): void {
		if (this.spawnCooldown <= 0) {
			const enemy = new Enemy(this.ground, this.spawnTexture, this.state, this.status.quadrants[0]);
			this.state.actorManager.addActor(enemy);
			this.spawnCooldown = 4000;
		}
	}
}