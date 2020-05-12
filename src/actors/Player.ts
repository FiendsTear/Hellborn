// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import { interaction, Sprite } from 'pixi.js';
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
	meleeSound: HTMLAudioElement;
	meleeReady: boolean;
	maxStamina: number;
	maxSpeed: number;
	currentStamina: number;
	legs: AnimatedSprite;
	body: Sprite;

	constructor(game: Game, legsTexture: PIXI.Texture[], bodyTexture: PIXI.Texture, state: Game, quadrant: Quadrant, bulletTexture: PIXI.Texture) {
		const type = 'player';
		super(state, type, quadrant, game.camera.ground);
		this.game = game;

		this.bulletTexture = bulletTexture;

		this.hitBoxRadius = 20;
		this.zIndex = 1;

		this.legs = new AnimatedSprite(legsTexture);
		this.legs.anchor.x = 0.5;
		this.legs.anchor.y = 0.5;
		this.legs.animationSpeed = 0.1;
		this.addChild(this.legs);

		this.body = new Sprite(bodyTexture);
		this.body.anchor.x = 0.5;
		this.body.anchor.y = 0.5;
		this.addChild(this.body);

		// this.rotation = -(Math.PI/2);

		this.maxSpeed = 4;
		this.status.speed = 0;
		// this.rotation = -(3*Math.PI/2);
		this.interactive = true;

		this.maxHealth = 100;
		this.status.health = this.maxHealth;

		this.maxStamina = 100;
		this.currentStamina = this.maxStamina;
		this.game.camera.hud.draw();

		this.weaponReady = true;
		this.meleeReady = true;
		this.reloadTime = 0;
		this.shotSound = new Audio('./assets/sounds/shot.wav');
		this.shotSound.volume = 0.1;
		this.meleeSound = new Audio('./assets/sounds/melee.wav');
		this.meleeSound.volume = 0.5;

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
		if (this.weaponReady && this.game.input.mouse.pressed && this.game.input.keys.shift) {
			this.shoot();
		}
		if (this.meleeReady && this.game.input.mouse.pressed) {
			this.melee();
		}
	}

	controlMovement() {
		let direction = 0;
		this.status.speed = this.maxSpeed;
		const keys = this.game.input.keys;
		if (keys.space && this.currentStamina > 0) {
			this.status.speed = 8;
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
			const diffBodyLegs = Math.cos(this.body.rotation - direction);
			if (diffBodyLegs > 0) {
				this.legs.rotation = direction;
			}
			else {
				this.status.speed = this.status.speed/1.5;
				this.legs.rotation = direction + Math.PI;
			}
			this.legs.play();
			this.calculateDestination(direction);
		}
		else {
			this.legs.gotoAndStop(0);
		}
	}

	controlSight() {
		const actorRelativeToCameraX = this.x + this.ground.x;
		const actorRelativeToCameraY = this.y + this.ground.y;
		let angle = Math.atan2(this.game.input.mouse.y - actorRelativeToCameraY, this.game.input.mouse.x - actorRelativeToCameraX);
		this.body.rotation = angle;
	}

	shoot() {
<<<<<<< HEAD
		if (this.weaponReady && this.game.input.mouse.pressed) {
			this.shotSound.play();
			const shooterFaceCenterX = this.x + this.hitBoxRadius * Math.cos(this.body.rotation);
			const shooterFaceCenterY = this.y + this.hitBoxRadius * Math.sin(this.body.rotation);
			let bulletQuadrant = this.state.grid.getQuadrantByCoords(shooterFaceCenterX, shooterFaceCenterY);
			const bullet = new Projectile(this.bulletTexture, this.state, 'projectile', bulletQuadrant, this.ground, this);
			this.ground.addChild(bullet);
			this.weaponReady = false;
			this.reloadTime = 2000;
		}
=======
		this.shotSound.play();
		const shooterFaceCenterX = this.x + this.hitBoxRadius * Math.cos(this.rotation);
		const shooterFaceCenterY = this.y + this.hitBoxRadius * Math.sin(this.rotation);
		let bulletQuadrant = this.state.grid.getQuadrantByCoords(shooterFaceCenterX, shooterFaceCenterY);
		const bullet = new Projectile(this.bulletTexture, this.state, 'projectile', bulletQuadrant, this.ground, this);
		this.ground.addChild(bullet);
		this.weaponReady = false;
		this.reloadTime = 2000;
	}

	melee() {
		this.meleeSound.play();
		this.meleeReady = false;
>>>>>>> melee
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