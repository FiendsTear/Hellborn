// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
// eslint-disable-next-line no-unused-vars
import { interaction, Sprite } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../../physics/Grid';
// eslint-disable-next-line no-unused-vars
import {AnimatedSprite} from 'pixi.js';
import { Weapon } from './Weapon';
// eslint-disable-next-line no-unused-vars

export default class Player extends Actor {
	game: Game;
	maxStamina: number;
	maxSpeed: number;
	currentStamina: number;
	legs: AnimatedSprite;
	body: AnimatedSprite;
	equippedWeapon: Weapon;
	weapons: Weapon[];

	constructor(game: Game, legsTexture: PIXI.Texture[], bodyTexture: PIXI.Texture[], state: Game, quadrant: Quadrant, projectileTexture: PIXI.Texture) {
		const type = 'player';
		super(state, type, game.camera.ground, quadrant);
		this.game = game;

		this.hitBoxRadius = 20;
		this.zIndex = 1;

		this.legs = new AnimatedSprite(legsTexture);
		this.legs.anchor.x = 0.5;
		this.legs.anchor.y = 0.5;
		this.legs.animationSpeed = 0.1;
		this.addChild(this.legs);

		this.body = new AnimatedSprite(bodyTexture);
		this.body.anchor.x = 0.5;
		this.body.anchor.y = 0.5;
		this.body.animationSpeed = 0.2;
		this.body.loop = false;
		this.addChild(this.body);

		this.maxSpeed = 4;
		this.status.speed = 0;
		this.interactive = true;

		this.maxHealth = 100;
		this.status.health = this.maxHealth;

		this.maxStamina = 100;
		this.currentStamina = this.maxStamina;
		this.game.camera.hud.draw();

		this.weapons = [];
		this.weapons[0] = new Weapon(projectileTexture, this);
		this.weapons[1] = new Weapon(projectileTexture, this);
		this.weapons[2] = new Weapon(projectileTexture, this);
		this.equippedWeapon = this.weapons[0];

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
		this.equippedWeapon.update();
		if (this.equippedWeapon.ready && this.game.input.mouse.pressed) {
			this.equippedWeapon.shoot();
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
			if (diffBodyLegs > -0.3) {
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

}