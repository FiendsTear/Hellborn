// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
// eslint-disable-next-line no-unused-vars
import Engine from '../../Engine';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../../physics/Grid';
// eslint-disable-next-line no-unused-vars
import {AnimatedSprite} from 'pixi.js';
import { Weapon } from './Weapon';
// eslint-disable-next-line no-unused-vars

export default class Player extends Actor {
	maxStamina: number;
	maxSpeed: number;
	currencyAmount: number;
	currentStamina: number;
	legs: AnimatedSprite;
	body: AnimatedSprite;
	equippedWeapon: Weapon;
	weapons: Weapon[];

	constructor(engine: Engine, quadrant: Quadrant, projectileTexture: PIXI.Texture) {
		const kind = 'player';
		super(engine, kind, engine.ground, quadrant);

		this.hitBoxRadius = 20;
		this.zIndex = 1;

		const resources = this.engine.loader.resources;

		this.legs = new AnimatedSprite(resources.playerLegs.spritesheet.animations['legs']);
		this.legs.anchor.x = 0.5;
		this.legs.anchor.y = 0.5;
		this.legs.animationSpeed = 0.1;
		this.addChild(this.legs);

		this.body = new AnimatedSprite([resources.playerBodyRanged.texture]);
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

		this.currencyAmount = 0;

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
		if (this.equippedWeapon.ready && this.engine.input.mouse.pressed) {
			this.equippedWeapon.shoot();
		}
	}

	controlMovement() {
		let direction = 0;
		this.status.speed = this.maxSpeed;
		const keys = this.engine.input.keys;
		if (keys.space && this.currentStamina > 0) {
			this.status.speed = 8;
			this.currentStamina = this.currentStamina - 1;
			this.engine.hud.updateStaminaBar();
		}
		if (this.currentStamina < this.maxStamina) {
			this.currentStamina = this.currentStamina + 0.1;
			this.engine.hud.updateStaminaBar();
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
		const angle = Math.atan2(this.engine.input.mouse.y - actorRelativeToCameraY, this.engine.input.mouse.x - actorRelativeToCameraX);
		this.body.rotation = angle;
	}

	reduceHealth(damage: number) {
		this.status.health = this.status.health - damage;
		this.engine.hud.updateHealthBar();
	}

	changeCurrencyAmount(amount: number) {
		this.currencyAmount = this.currencyAmount + amount;
		this.engine.hud.updateCurrencyAmount();
	}

}