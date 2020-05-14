// eslint-disable-next-line no-unused-vars
import { Point, Container } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
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
	type: string;
	status: Status;

	maxHealth: number;
	hitBoxRadius: number;
	strength: number;

	state: Game;
	ground: Ground;

	isObstacle: boolean;
	movable: boolean;

	constructor(state: Game, type: string, ground: Ground, quadrant?: Quadrant, x?: number, y?: number) {
		super();
		
		/**
		 * Whenever you assign private fields to arguments passed to the constructor
		 * you can remove the field declaration and write your constructor like this:
		 * 
		 * constructor(private state: Game, private type: string, private quadrant: Quadrant, private ground: Ground) {
		 * 
		 * }
		 * 
		 * In this example I used private, but you can use any access modifier you want (private, protected, public)
		 * 
		 * (More info here: https://dev.to/satansdeer/typescript-constructor-shorthand-3ibd )
		 * 
		 */
		this.state = state;
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
		this.type = type;
		/**
		You have a section in the app for stateMangement. I think it would make a lot
		more sense to assign these IDs there. With this approach you're using here you're
		breaking the abstraction of an Actor by making the Actor class "know" about every possible type,
		and also making instances define their own ID which doesn't make much sense.

		Last, besides the fact you should remove this code from here, make sure that you always use '===' in JS/TS.
		*/
		if (type === 'enemy') this.id = this.type + (state.enemiesCount + 1);
		if (type === 'player') this.id = this.type + (state.playersCount + 1);
		if (type ==='projectile') this.id = this.type + (state.projectilesCount + 1);
		if (type === 'spawner') this.id = this.type + (state.spawnerCount + 1);

		// this.hitBoxRadius = Math.floor(Math.sqrt(this.height/2*this.height/2 + this.width/2*this.width/2));
		if (quadrant) {
			this.status.quadrants.push(quadrant);
			let actorCenterX;
			let actorCentery;
			actorCenterX = (quadrant.x1 + quadrant.x2)/2;	
			actorCentery = (quadrant.y1 + quadrant.y2)/2;
			this.x = actorCenterX;
			this.y = actorCentery;
		}
		else {
			this.x = x;
			this.y = y;
			let quadrant = this.state.grid.getQuadrantByCoords(x, y);
			this.status.quadrants.push(quadrant);
		}

		this.status.destination.x = this.x;
		this.status.destination.y = this.y;

		// You are not using isObstacle anywhere in the code. Does this even need to be here at all?
		this.isObstacle = true;
		// Is it the responsibility of an Actor to add itself to the state?
		// wouldn't it be better if whatever creates an actor instance adds it to the state / Game?
		this.state.addActor(this);

		this.move = this.move.bind(this);
		this.calculateDestination = this.calculateDestination.bind(this);
	}

	move() {
		this.x = this.status.destination.x;
		this.y = this.status.destination.y;

	}

	/**
	 * I'd make it clearer here that calculateDestination does indeed make changes to the state
	 * (due to the state.prepareToMoveActor call). In fact it's not super clear what this does.
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
		this.state.prepareToMoveActor(this);
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

		// Why are actors added to the state and removed from the ground?
		// Seems like a weird way of adding/removing resources.
		this.ground.removeChild(this);
		for (let i = 0, quadrantCount = this.status.quadrants.length; i < quadrantCount; i++) {
			const quadrant = this.status.quadrants[i];
			quadrant.activeActors.splice(quadrant.activeActors.indexOf(this.id), 1);
		}
	}
}