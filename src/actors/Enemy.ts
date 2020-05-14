// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import {Quadrant} from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';
import {Sprite} from 'pixi.js';

export default class Enemy extends Actor {
	attackCooldown: number;
	attackReach: number;
	sprite: Sprite;

	constructor(ground: Ground, texture: PIXI.Texture, state: Game, quadrant: Quadrant) {
		// you're using typescript. You probably don't need this.
		// And if you do, you should use Typescript's types (or enums) to enforce some type/value safety.
		const type = 'enemy';
		super(state, type, ground, quadrant);

		this.zIndex = 1;
		this.sprite = new Sprite(texture);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.addChild(this.sprite);
		this.rotation = -(Math.PI/2);
		
		this.attackCooldown = 0;
		this.status.attackReady = true;
		this.hitBoxRadius = 28;
		this.attackReach = 50;

		this.strength = 80;
		this.maxHealth = 80;
		this.status.health = this.maxHealth;
		this.status.speed = 3;
		this.movable = true;

		this.attack = this.attack.bind(this);
		this.act = this.act.bind(this);
	}
	
	prepare() {
		if (this.status.health <= 0) {
			this.die();
		}
		else {
			if (this.attackCooldown > 0) {
				this.attackCooldown = this.attackCooldown - this.state.ticker.elapsedMS;
				if (this.attackCooldown <= 0) {
					this.status.attackReady = true;
				}
			}
			this.status.moving = true;
			this.status.speed = 3;
	
			const player = this.state.actors.player1;
			// temporarily set as player1 cause there's no multiplayer yet
			const playerX = player.x;
			const playerY = player.y;
			const verticalDistance = playerY - this.y;
			const horizontalDistance = playerX - this.x;
			let direction = Math.atan2(verticalDistance, horizontalDistance);
			this.rotation = direction;
	
			this.calculateDestination(direction);
			
			const quadDistance = verticalDistance*verticalDistance + horizontalDistance*horizontalDistance;
			if (quadDistance <= this.attackReach*this.attackReach + player.hitBoxRadius*player.hitBoxRadius && this.status.attackReady) {
				this.attack(player);
			}
		}
	}

	act(): void {
		this.move();
	}

	attack(player: Actor): void {
		player.reduceHealth(10);
		if (player.status.health <= 0) {
			this.state.pause();
		}
		this.status.attackReady = false;
		this.attackCooldown = 1000;
	}
}