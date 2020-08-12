// eslint-disable-next-line no-unused-vars
import { Point, Container } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../physics/Grid';

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
	kind: string;
	status: Status;
	destination: PIXI.Point;

	maxHealth: number;
	hitBoxRadius: number;
	strength: number;

	engine: Engine;

	isObstacle: boolean;
	movable: boolean;

	constructor(engine: Engine, kind: string) {
		super();
		
		/**
		 * Whenever you assign private fields to arguments passed to the constructor
		 * you can remove the field declaration and write your constructor like this:
		 * 
		 * constructor(private engine: Engine, private kind: string, private quadrant: Quadrant, private engine.ground: engine.ground) {
		 * 
		 * }
		 * 
		 * In this example I used private, but you can use any access modifier you want (private, protected, public)
		 * 
		 * (More info here: https://dev.to/satansdeer/typescript-constructor-shorthand-3ibd )
		 * 
		 */
		this.engine = engine;
		this.status = {
			alive: true, 
			moving: false, 
			attacking: false, 
			attackReady: true,
			health: this.maxHealth,
			quadrants: [],
			speed: 0};
		this.kind = kind;
		this.destination = new Point();

		this.move = this.move.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	move() {
		this.x = this.destination.x;
		this.y = this.destination.y;
	}

	/**
	 * I'd make it clearer here that calculateDestination does indeed make changes to the engine
	 * (due to the engine.prepareToMoveActor call). In fact it's not super clear what this does.
	 */
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
		this.engine.grid.calculateNewQuadrants(this);
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