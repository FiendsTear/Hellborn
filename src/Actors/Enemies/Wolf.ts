// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
// eslint-disable-next-line no-unused-vars
import {IResourceDictionary, AnimatedSprite} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Ground from '../../StageManager/Ground';
import Player from '../Player/Player';

export default class Wolf extends Actor {
	attackCooldown: number;
	attackReach: number;
	sprite: AnimatedSprite;
	charging: boolean;
	chargingSpeed: number;
	chargingDistance: number;
	quadDistanceToPlayer: number;

	constructor(ground: Ground, resources: IResourceDictionary, private player: Player) {
		super(ground, resources, 'enemy');

		this.zIndex = 1;
		this.sprite = new AnimatedSprite(resources.wolf.spritesheet.animations['wolf']);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.addChild(this.sprite);
		this.sprite.animationSpeed = 0.1;
		this.sprite.play();
		this.rotation = -(Math.PI/2);
		
		this.attackCooldown = 0;
		this.status.attackReady = true;
		this.hitBoxRadius = 28;
		this.attackReach = 50;

		this.strength = 80;
		this.maxHealth = 80;
		this.status.health = this.maxHealth;
		
		this.chargingSpeed = 8;
		this.charging = false;
		this.chargingDistance = 250;

		this.movement.currentSpeed = 0;

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

		const verticalDistance = this.player.y - this.y;
		const horizontalDistance = this.player.x - this.x;
		this.quadDistanceToPlayer = verticalDistance*verticalDistance + horizontalDistance*horizontalDistance;
		if (!this.charging) {
			if (this.quadDistanceToPlayer <= this.chargingDistance*this.chargingDistance) {
				this.charging = true;
				this.movement.currentSpeed = this.chargingSpeed;
				this.status.moving = true;
				this.movement.direction = Math.atan2(verticalDistance, horizontalDistance);
				this.rotation = this.movement.direction;
			}
		}
		if (this.status.moving) {
			this.changeSpeed();
			this.calculateDestination();
		}
	}

	act(): void {
		if (this.status.moving) {
			this.move();
		}
		if (this.quadDistanceToPlayer <= this.attackReach*this.attackReach + this.player.hitBoxRadius*this.player.hitBoxRadius && this.status.attackReady) {
			this.attack(this.player);
		}
	}

	attack(player: Actor): void {
		player.reduceHealth(10);
		this.status.attackReady = false;
		this.attackCooldown = 1000;
	}
}