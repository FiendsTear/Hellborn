// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
// eslint-disable-next-line no-unused-vars
import GameState from '../../stateManagement/GameState';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Ground from '../../helpers/Ground';

export default class Projectile extends Actor {
	direction: number;
	lifespan: number;

	constructor(texture: PIXI.Texture, state: GameState, type: string, quadrant: Quadrant, ground: Ground, shooter: Actor) {
		super(texture, state, type, quadrant, ground);
		this.type = 'projectile';
		const shooterFaceCenterX = shooter.x + shooter.hitBoxRadius * Math.cos(shooter.rotation);
		const shooterFaceCenterY = shooter.y + shooter.hitBoxRadius * Math.sin(shooter.rotation);
		this.x = shooterFaceCenterX;
		this.y = shooterFaceCenterY; 
		this.speed = 25;
		this.lifespan = 300;
		this.status.moving = true;
		this.direction = shooter.rotation + Math.random() * Math.PI/30 - Math.PI/60;
		this.movable = false;
		this.hitBoxRadius = 3;
		this.hit = this.hit.bind(this);
	}
	prepare() {
		this.calculateDestination(this.direction);
	}

	act() {
		this.move();
		this.lifespan = this.lifespan - this.state.ticker.elapsedMS;
		if (this.lifespan <= 0) {
			this.die();
		}
	}

	hit(actor: Actor) {
		actor.reduceHealth(15);
		this.die();
	}
}