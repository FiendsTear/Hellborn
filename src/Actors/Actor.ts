// eslint-disable-next-line no-unused-vars
import { Point, Container, IResourceDictionary, Sprite } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Ground, { Quadrant } from '../StageManager/Ground';
import { Calculations } from '../helpers/Calculations';

interface Status {
	moving: boolean;
	alive: boolean;
	attacking: boolean;
	attackReady: boolean;
	health: number;
	quadrants: Quadrant[];
}

export const enum Pace {
	standing = 1, walking, charging, backing
}

interface Movement {
	pace: Pace;
	currentSpeed: number;
 
	chargeSpeed: number;
	chargeAcceleration: number;
	chargeStaminaConsumption: number;
	chargeTurningSpeed: number;
	chargeAnimationSpeed: number;

	walkSpeed: number;
	walkAcceleration: number;
	walkTurningSpeed: number;
	walkAnimationSpeed: number;

	deceleration: number;
	backingMultiplier: number;

	standTurningSpeed: number;

	direction: number;
}

export default abstract class Actor extends Container {
	id: string;
	status: Status;
	destination: PIXI.Point;

	maxHealth: number;
	hitBoxRadius: number;
	strength: number;

	isObstacle: boolean;
	collidedWith: Actor[];
	movement: Movement;

	constructor(public ground: Ground, protected resources: IResourceDictionary, public kind: string) {
		super();
		
		this.status = {
			alive: true, 
			moving: false, 
			attacking: false, 
			attackReady: true,
			health: this.maxHealth,
			quadrants: []};
		this.movement = {
			currentSpeed: 0,
			direction: 0,
			pace: Pace.standing,
			standTurningSpeed: 0,
			deceleration: 0,
			backingMultiplier: 0,

			chargeSpeed: 0,
			chargeAcceleration: 0,
			chargeAnimationSpeed: 0,
			chargeStaminaConsumption: 0,
			chargeTurningSpeed: 0,

			walkSpeed: 0,
			walkAcceleration: 0,
			walkAnimationSpeed: 0,
			walkTurningSpeed: 0,
		};
		this.destination = new Point();
		this.collidedWith = [];

		this.move = this.move.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	move() {
		this.x = this.destination.x;
		this.y = this.destination.y;
		this.ground.calculateNewQuadrants(this);
	}

	calculateDestination() {
		let x = this.x + this.movement.currentSpeed * Math.cos(this.movement.direction);
		let y = this.y + this.movement.currentSpeed * Math.sin(this.movement.direction);
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
		this.status.alive = false;
	}

	removeQuadrantFromStatus(quadrant: Quadrant) {
		const quadrantIndexInArray = this.ground.checkQuadrantInArray(this.status.quadrants, quadrant);
		this.status.quadrants.splice(quadrantIndexInArray, 1);
	}

	changeSpeed() {
		let maxSpeed;
		let acceleration;
		if (this.movement.pace === Pace.standing) {
			maxSpeed = 0;
			acceleration = this.movement.deceleration;
		}
		if (this.movement.pace === Pace.walking) {
			maxSpeed = this.movement.walkSpeed;
			acceleration = this.movement.walkAcceleration;
		}
		if (this.movement.pace === Pace.charging) {
			maxSpeed = this.movement.chargeSpeed;
			acceleration = this.movement.chargeAcceleration;
		}
		if (this.movement.pace === Pace.backing) {
			maxSpeed = this.movement.walkSpeed * this.movement.backingMultiplier;
			acceleration = this.movement.deceleration;
		}
		this.movement.currentSpeed = Calculations.getValueCloserToMax(
			this.movement.currentSpeed,
			acceleration,
			maxSpeed);
	}

	changeDirection(turnTo: number) {
		let turningSpeed;
		switch(this.movement.pace) {
		case Pace.standing:
			turningSpeed = this.movement.standTurningSpeed;
			break;
		case Pace.walking:
			turningSpeed = this.movement.walkTurningSpeed;
			break;
		case Pace.backing:
			turningSpeed = this.movement.walkTurningSpeed;
			break;
		case Pace.charging:
			turningSpeed = this.movement.chargeTurningSpeed;
			break;
		default:
			turningSpeed = this.movement.standTurningSpeed;
			break;
		}
		this.movement.direction = Calculations.rotate(this.movement.direction, turningSpeed, turnTo);
	}
}