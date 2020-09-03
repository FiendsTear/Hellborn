// eslint-disable-next-line no-unused-vars
import Actor, { Pace } from '../Actor';
// eslint-disable-next-line no-unused-vars
import {IResourceDictionary, AnimatedSprite} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Ground from '../../StageManager/Ground';
import Player from '../Player/Player';

export default class Wolf extends Actor {
	attackCooldown: number;
	attackReach: number;
	sprite: AnimatedSprite;
	chargingDistance: number;
	quadDistanceToPlayer: number;
	awareOfPlayer: boolean;
	awareDistance: number;

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
		
		this.chargingDistance = 250;
		this.movement.chargeSpeed = 8;
		this.movement.chargeTurningSpeed = 0.03;
		this.movement.chargeAcceleration = 0.6;

		this.movement.walkSpeed = 5;
		this.movement.walkTurningSpeed = 0.4;
		this.movement.walkAcceleration = 0.3;

		this.movement.currentSpeed = 0;

		this.awareOfPlayer = false;
		this.awareDistance = 500;

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
		if (!this.awareOfPlayer) {
			if (this.quadDistanceToPlayer < this.awareDistance * this.awareDistance) {
				this.awareOfPlayer = true;
			}
		}
		if (this.awareOfPlayer) {
			this.movement.pace = Pace.walking;
			this.changeDirection(Math.atan2(verticalDistance, horizontalDistance));
			console.log(this.movement.direction);
			this.rotation = this.movement.direction;
		}
		if (this.movement.pace === Pace.charging) {
			if (this.quadDistanceToPlayer <= this.chargingDistance*this.chargingDistance) {
				this.movement.pace = Pace.charging;
				this.movement.direction = Math.atan2(verticalDistance, horizontalDistance);
				this.rotation = this.movement.direction;
			}
		}
		if (this.movement.pace !== Pace.standing) {
			this.changeSpeed();
			this.calculateDestination();
		}
	}

	act(): void {
		if (this.movement.pace !== Pace.standing) {
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