// eslint-disable-next-line no-unused-vars
import { Point, Container } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../managers/Ground';

interface Status {
	moving: boolean;
	alive: boolean;
	attacking: boolean;
	attackReady: boolean;
	health: number;
	quadrants: Quadrant[];
	speed: number;
}

export default abstract class Actor extends Container {
	id: string;
	status: Status;
	destination: PIXI.Point;

	maxHealth: number;
	hitBoxRadius: number;
	strength: number;

	isObstacle: boolean;
	movable: boolean;

	constructor(protected engine: Engine, public kind: string) {
		super();
		
		this.status = {
			alive: true, 
			moving: false, 
			attacking: false, 
			attackReady: true,
			health: this.maxHealth,
			quadrants: [],
			speed: 0};

		this.destination = new Point();

		this.move = this.move.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	move() {
		this.x = this.destination.x;
		this.y = this.destination.y;
		this.engine.ground.calculateNewQuadrants(this);
	}

	calculateDestination(direction: number) {
		let x = this.x + this.status.speed * Math.cos(direction);
		let y = this.y + this.status.speed * Math.sin(direction);
		if (x - this.hitBoxRadius <= 0) {
			x = this.hitBoxRadius;
		}
		if (x + this.hitBoxRadius >= this.engine.ground.fixedWidth) {
			x = this.engine.ground.fixedWidth - this.hitBoxRadius;
		}
		if (y - this.hitBoxRadius <= 0) {
			y = this.hitBoxRadius;
		}
		if (y + this.hitBoxRadius >= this.engine.ground.fixedHeight) {
			y = this.engine.ground.fixedHeight - this.hitBoxRadius;
		}
		this.destination.x = x;
		this.destination.y = y;
	}

	reduceHealth(damage: number) {
		this.status.health = this.status.health - damage;
	}

	prepare() {}
	act(){}
	// eslint-disable-next-line no-unused-vars
	hit(actor: Actor){}
	
	die() {
		this.status.speed = 0;
		this.status.alive = false;
		this.engine.actorManager.removeActor(this);
	}
}