// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import { interaction } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
import Projectile from './Projectile';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import {AnimatedSprite} from 'pixi.js';
// eslint-disable-next-line no-unused-vars

export default class Player extends Actor {
	game: Game;
	bulletTexture: PIXI.Texture;
	weaponReady: boolean;
	reloadTime: number;
	shotSound: HTMLAudioElement;
	maxStamina: number;
	currentStamina: number;
	sprite: AnimatedSprite;

	constructor(game: Game, texture: PIXI.Texture[], state: Game, quadrant: Quadrant, bulletTexture: PIXI.Texture) {
		const type = 'player';
		super(state, type, quadrant, game.camera.ground);
		this.game = game;

		this.bulletTexture = bulletTexture;

		this.hitBoxRadius = 20;
		this.zIndex = 1;
		this.sprite = new AnimatedSprite(texture);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.sprite.animationSpeed = 0.1;
		this.addChild(this.sprite);
		this.rotation = -(Math.PI/2);

		this.speed = 4;
		this.rotation = -(3*Math.PI/2);
		this.interactive = true;

		this.maxHealth = 100;
		this.currentHealth = this.maxHealth;

		this.maxStamina = 100;
		this.currentStamina = this.maxStamina;
		this.game.camera.hud.draw();

		this.weaponReady = true;
		this.reloadTime = 0;
		this.shotSound = new Audio('./assets/sounds/shot.wav');

		this.strength = 90;
		this.movable = true;

		this.act = this.act.bind(this);
		this.controlMovement = this.controlMovement.bind(this);
	}

	prepare() {
		this.controlMovement();
		this.controlSight();
	}

	act() {
		this.move();
		this.reload();
		this.shoot();
	}

	// You should probably simplify this logic.
	// You are mixing up the calculation of direction and speed
	// With modifying the state (like reducing/increasing stamina)
	// this.status.moving can be simplified like this:
	//
	// const movingVertically = this.keysDown.w?!this.keysDown.s:this.keysDown.s;
	// const movingLaterally = this.keysDown.a?!this.keysDown.d:this.keysDown.d;
	// this.status.moving = movingLaterally || movingVertically;
	// 
	// and only once you've determined you're moving you should calculate direction,
	// check stamina / shift / etc.
	controlMovement() {
		let direction = 0;
		this.speed = 4;
		const keys = this.game.input.keys;
		if (keys.shift && this.currentStamina > 0) {
			this.speed = 8;
			this.currentStamina = this.currentStamina - 1;
			this.game.camera.hud.draw();
		}
		if (this.currentStamina < this.maxStamina) {
			this.currentStamina = this.currentStamina + 0.1;
			this.game.camera.hud.draw();
		}
		this.status.moving = false;
		if (keys.w) {
			this.status.moving = true;
			direction = -Math.PI/2;
		}
		if (keys.s) {
			if (keys.w) {
				this.status.moving = false;
			}
			else {
				direction = Math.PI/2;
				this.status.moving = true;
			}
		}
		if (keys.d) {   
			if (keys.s) {
				direction = direction - Math.PI/4;
			}
			if (keys.w) {
				direction = direction + Math.PI/4;
			}
			if (!keys.s && !keys.w) {
				direction = 0;
			}
			this.status.moving = true;
		}
		if (keys.a) {
			if (keys.d) {
				this.status.moving = false;
			}
			else {
				this.status.moving = true;
				if (keys.w) {
					direction = direction - Math.PI/4;
				}
				if (keys.s) {
					direction = direction + Math.PI/4;
				}	
				if (!keys.w && !keys.s) {
					direction = Math.PI;
				}
			}
		}
		if (this.status.moving) {
			this.sprite.play();
			this.calculateDestination(direction);
		}
		else {
			this.sprite.gotoAndStop(0);
		}
	}

	controlSight() {
		const actorRelativeToCameraX = this.x + this.ground.x;
		const actorRelativeToCameraY = this.y + this.ground.y;
		let angle = Math.atan2(this.game.input.mouse.y - actorRelativeToCameraY, this.game.input.mouse.x - actorRelativeToCameraX);
		this.rotation = angle;
	}

	shoot() {
		if (this.weaponReady && this.game.input.mouse.pressed) {
			this.shotSound.play();
			const shooterFaceCenterX = this.x + this.hitBoxRadius * Math.cos(this.rotation);
			const shooterFaceCenterY = this.y + this.hitBoxRadius * Math.sin(this.rotation);
			let bulletQuadrant = this.state.grid.getQuadrantByCoords(shooterFaceCenterX, shooterFaceCenterY);
			const bullet = new Projectile(this.bulletTexture, this.state, 'projectile', bulletQuadrant, this.ground, this);
			this.ground.addChild(bullet);
			this.weaponReady = false;
			this.reloadTime = 2000;
		}
	}

	reload() {
		if (this.reloadTime >= 0) {
			this.reloadTime = this.reloadTime - this.state.ticker.elapsedMS;
		}
		else {
			this.weaponReady = true;
		}
	}
}