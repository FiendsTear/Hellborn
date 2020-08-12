// eslint-disable-next-line no-unused-vars
import { Point, Container } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';

interface Status {
	moving: boolean;
	alive: boolean;
	attacking: boolean;
	attackReady: boolean;
	health: number;
	quadrants: Quadrant[];
	destination: PIXI.Point;
	speed: number;
}

export default abstract class Actor extends Container {
	id: string;
	kind: string;
	status: Status;

	maxHealth: number;
	hitBoxRadius: number;
	strength: number;

	engine: Engine;
	ground: Ground;

	isObstacle: boolean;
	movable: boolean;

	constructor(engine: Engine, kind: string, ground: Ground, quadrant?: Quadrant, x?: number, y?: number) {
		super();
		
		/**
		 * Whenever you assign private fields to arguments passed to the constructor
		 * you can remove the field declaration and write your constructor like this:
		 * 
		 * constructor(private engine: Engine, private kind: string, private quadrant: Quadrant, private ground: Ground) {
		 * 
		 * }
		 * 
		 * In this example I used private, but you can use any access modifier you want (private, protected, public)
		 * 
		 * (More info here: https://dev.to/satansdeer/typescript-constructor-shorthand-3ibd )
		 * 
		 */
		this.engine = engine;
		this.ground = ground;
		this.status = {
			alive: true, 
			moving: false, 
			attacking: false, 
			attackReady: true,
			health: this.maxHealth,
			quadrants: [],
			destination: new Point(),
			speed: 0};
		this.kind = kind;

		if (quadrant) {
			this.status.quadrants.push(quadrant);
			const actorCenterX = (quadrant.x1 + quadrant.x2)/2;	
			const actorCentery = (quadrant.y1 + quadrant.y2)/2;
			this.x = actorCenterX;
			this.y = actorCentery;
		}
		else {
			this.x = x;
			this.y = y;
			const quadrant = this.engine.grid.getQuadrantByCoords(x, y);
			this.status.quadrants.push(quadrant);
		}

		this.status.destination.x = this.x;
		this.status.destination.y = this.y;

		this.move = this.move.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	move() {
		this.x = this.status.destination.x;
		this.y = this.status.destination.y;

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
		if (x + this.hitBoxRadius >= this.ground.fixedWidth) {
			x = this.ground.fixedWidth - this.hitBoxRadius;
		}
		if (y - this.hitBoxRadius <= 0) {
			y = this.hitBoxRadius;
		}
		if (y + this.hitBoxRadius >= this.ground.fixedHeight) {
			y = this.ground.fixedHeight - this.hitBoxRadius;
		}
		this.status.destination.x = x;
		this.status.destination.y = y;
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