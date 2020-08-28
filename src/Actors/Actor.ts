// eslint-disable-next-line no-unused-vars
import { Point, Container, Ticker, IResourceDictionary } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Ground, { Quadrant } from '../StageManager/Ground';

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

	constructor(public ground: Ground, protected resources: IResourceDictionary, public kind: string) {
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
		this.ground.calculateNewQuadrants(this);
	}

	calculateDestination(direction: number) {
		let x = this.x + this.status.speed * Math.cos(direction);
		let y = this.y + this.status.speed * Math.sin(direction);
		if (x - this.hitBoxRadius <= 0) {
			x = this.hitBoxRadius;
		}
		if (x + this.hitBoxRadius >= this.ground.fixedWidth) {
			x = this.ground.fixedWidth - this.hitBoxRadius;
		}
		if (y - this.hitBoxRadius <= 0) {
			y = this.hitBoxRadius;
		}
		if (y + this.hitBoxRadius >= this.ground.fixedHeight) {
			y = this.ground.fixedHeight - this.hitBoxRadius;
		}
		this.destination.x = x;
		this.destination.y = y;
	}

	reduceHealth(damage: number) {
		this.status.health = this.status.health - damage;
		if (this.status.health <= 0) {
			this.die();
		}
	}

	prepare(elapsedMS: number) {}
	act(){}
	// eslint-disable-next-line no-unused-vars
	hit(actor: Actor){}
	
	die() {
		this.status.speed = 0;
		this.status.alive = false;
	}

	removeQuadrantFromStatus(quadrant: Quadrant) {
		const quadrantIndexInArray = this.ground.checkQuadrantInArray(this.status.quadrants, quadrant);
		this.status.quadrants.splice(quadrantIndexInArray, 1);
	}
}