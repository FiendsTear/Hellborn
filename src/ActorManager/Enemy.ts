// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import {Sprite, IResourceDictionary} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Player from './Player';
import Ground from '../StageManager/Ground';

export default class Enemy extends Actor {
	attackCooldown: number;
	attackReach: number;
	sprite: Sprite;
	player: Player;

	constructor(ground: Ground, resources: IResourceDictionary) {
		super(ground, resources, 'enemy');

		this.player = this.ground.player as Player;
		this.zIndex = 1;
		this.sprite = new Sprite(resources.enemy.texture);
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
	
	prepare(elapsedMS: number) {
		if (this.attackCooldown > 0) {
			this.attackCooldown = this.attackCooldown - elapsedMS;
			if (this.attackCooldown <= 0) {
				this.status.attackReady = true;
			}
		}
		this.status.moving = true;
		this.status.speed = 3;

		// temporarily set as player1 cause there's no multiplayer yet
		const playerX = this.player.x;
		const playerY = this.player.y;
		const verticalDistance = playerY - this.y;
		const horizontalDistance = playerX - this.x;
		const direction = Math.atan2(verticalDistance, horizontalDistance);
		this.rotation = direction;

		this.calculateDestination(direction);
		
		const quadDistance = verticalDistance*verticalDistance + horizontalDistance*horizontalDistance;
		if (quadDistance <= this.attackReach*this.attackReach + this.player.hitBoxRadius*this.player.hitBoxRadius && this.status.attackReady) {
			this.attack(this.player);
		}
	}

	act(): void {
		this.move();
	}

	attack(player: Actor): void {
		player.reduceHealth(10);
		// if (player.status.health <= 0) {
		// 	this.engine.switchPause();
		// }
		this.status.attackReady = false;
		this.attackCooldown = 1000;
	}
}