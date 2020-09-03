// eslint-disable-next-line no-unused-vars
import Actor, {Pace} from '../Actor';
// eslint-disable-next-line no-unused-vars
import {AnimatedSprite, IResourceDictionary} from 'pixi.js';
import Weapon from './Weapon';
import Ground from '../../StageManager/Ground';
import PlayerManager from '../../PlayerManager/PlayerManager';
import HUD from '../../Interface/HUD';
import Input from '../../Input';
import StageManager from '../../StageManager';
import { Calculations } from '../../helpers/Calculations';

export default class Player extends Actor {
	maxStamina: number;
	staminaRegeneration: number;
	currentStamina: number;

	currencyAmount: number;
	legs: AnimatedSprite;
	body: AnimatedSprite;
	equippedWeapon: Weapon;
	weapons: Weapon[];
	hud: HUD;
	bodyRotationSpeed: number;

	constructor(
		ground: Ground, 
		resources: IResourceDictionary, 
		private input: Input,
		private playerManager: PlayerManager,
		private stageManager: StageManager) {

		super(ground, resources, 'player');

		this.hitBoxRadius = 20;
		this.zIndex = 1;

		this.legs = new AnimatedSprite(resources.playerLegs.spritesheet.animations['legs']);
		this.legs.anchor.x = 0.5;
		this.legs.anchor.y = 0.5;
		this.legs.animationSpeed = 0.1;
		this.addChild(this.legs);

		this.body = new AnimatedSprite([resources.playerBody.texture]);
		this.body.anchor.x = 0.3;
		this.body.anchor.y = 0.6;
		this.body.animationSpeed = 0.2;
		this.body.loop = false;
		this.bodyRotationSpeed = 0.4;
		this.addChild(this.body);

		this.movement.chargeSpeed = 7;
		this.movement.chargeAcceleration = 0.4;
		this.movement.chargeStaminaConsumption = 0.7;
		this.movement.chargeTurningSpeed = 0.05;
		this.movement.chargeAnimationSpeed = 0.2;

		this.movement.walkSpeed = 4;
		this.movement.walkAcceleration = 0.2;
		this.movement.walkAnimationSpeed = 0.1;
		this.movement.walkTurningSpeed = 0.2;

		this.movement.pace = Pace.standing;
		this.movement.standTurningSpeed = this.bodyRotationSpeed;
		this.movement.currentSpeed = 0;

		this.movement.deceleration = 0.5;
		this.movement.backingMultiplier = 0.7;

		this.interactive = true;

		this.maxHealth = 100;
		this.status.health = this.maxHealth;

		this.maxStamina = 100;
		this.staminaRegeneration = 0.3;
		this.currentStamina = this.maxStamina;

		this.currencyAmount = 0;

		this.weapons = [];
		this.weapons[0] = new Weapon(this, this.stageManager.projectileManager, this.resources);
		this.equippedWeapon = this.weapons[0];

		this.strength = 90;

		this.act = this.act.bind(this);
		this.controlMovement = this.controlMovement.bind(this);
	}

	prepare(elapsedMS: number) {
		this.controlSight();
		const direction = this.calculateMoveDirectionFromInput();
		if (direction !== null) {
			this.changePaceFromInput();
			this.changeDirection(direction);
			this.controlMovement();
		}
		else {
			this.movement.pace = Pace.standing;
			this.changeDirection(this.body.rotation);
		}

		this.changeSpeed();
		this.equippedWeapon.update(elapsedMS);
	}

	act() {
		this.move();
		if (this.movement.pace === Pace.charging) {
			this.currentStamina = this.currentStamina - this.movement.chargeStaminaConsumption;
			this.hud.updateStaminaBar();
		}
		if (this.movement.pace !== Pace.charging && this.currentStamina < this.maxStamina) {
			this.currentStamina = this.currentStamina + this.staminaRegeneration;
			this.hud.updateStaminaBar();
		}
		if (this.equippedWeapon.ready && this.input.mouse.pressed) {
			this.equippedWeapon.shoot();
		}
	}

	calculateMoveDirectionFromInput() {
		const keys = this.input.keys;
		let direction = null;

		if (keys.w && !keys.s) {
			direction = -Math.PI/2;
		}

		if (keys.a) {
			if (!keys.d) {
				direction = Math.PI;
				if (keys.w && !keys.s) {
					direction = -3*Math.PI/4;
				}
			}
		}

		if (keys.s) {
			if (!keys.w) {
				direction = Math.PI/2;
				if (keys.a && !keys.w) {
					direction = 3*Math.PI/4;
				}
			}
		}

		if (keys.d) {
			if (!keys.a) {
				direction = 0;
				if (keys.w && !keys.s) {
					direction = -Math.PI/4;
				}
				if (keys.s && !keys.w) {
					direction = Math.PI/4;
				}
			}
		}

		return direction;
	}

	changePaceFromInput() {
		this.movement.pace = Pace.walking;

		const keys = this.input.keys;
		if (keys.space && this.currentStamina > 0 && this.movement.pace === Pace.walking) {
			this.movement.pace = Pace.charging;
		}
		const diffBodyLegs = Math.cos(this.body.rotation - this.movement.direction);
		if (diffBodyLegs < -0.3) {
			this.movement.pace = Pace.backing;
		}
	}

	controlMovement() {
		const diffBodyLegs = Math.cos(this.body.rotation - this.movement.direction);
		if (diffBodyLegs > -0.3) {
			this.legs.rotation = this.movement.direction;
		}
		else {
			this.legs.rotation = this.movement.direction + Math.PI;
		}
		this.legs.play();
		this.calculateDestination();
	}

	controlSight() {
		const actorRelativeToCameraX = this.x + this.ground.x;
		const actorRelativeToCameraY = this.y + this.ground.y;
		const angle = Math.atan2(this.input.mouse.y - actorRelativeToCameraY, this.input.mouse.x - actorRelativeToCameraX);
		this.body.rotation = Calculations.rotate(this.body.rotation, this.bodyRotationSpeed, angle);
	}

	reduceHealth(damage: number) {
		this.status.health = this.status.health - damage;
		this.hud.updateHealthBar();
	}

	changeCurrencyAmount(amount: number) {
		this.currencyAmount = this.currencyAmount + amount;
		this.hud.updateCurrencyAmount();
	}

}