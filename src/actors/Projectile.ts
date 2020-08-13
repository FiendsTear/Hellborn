// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
import {Sprite} from 'pixi.js';
import { Weapon } from './Player/Weapon';

export default class Projectile extends Actor {
	direction: number;
	lifespan: number;
	damage: number;
	sprite: Sprite;

	constructor(weapon: Weapon, direction: number, owner: Actor) {
		super(weapon.engine, 'projectile');
		this.sprite = new Sprite(weapon.projectileTexture);
		this.addChild(this.sprite);
		this.status.speed = weapon.projectileSpeed;
		this.lifespan = weapon.projectileLifespan;
		this.damage = weapon.damage;
		this.status.moving = true;
		this.direction = direction;
		this.movable = false;
		this.hitBoxRadius = 3;
		this.hit = this.hit.bind(this);
	}

	prepare() {
		this.calculateDestination(this.direction);
	}

	act() {
		this.move();
		this.lifespan = this.lifespan - this.engine.ticker.elapsedMS;
		if (this.lifespan <= 0) {
			this.die();
		}
	}

	hit(actor: Actor) {
		actor.reduceHealth(80);
		this.die();
	}
}