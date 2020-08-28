// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
import {Sprite, IResourceDictionary} from 'pixi.js';
import { Weapon } from './Player/Weapon';

export default class Projectile extends Actor {
	direction: number;
	lifespan: number;
	damage: number;
	sprite: Sprite;

	constructor(weapon: Weapon, direction: number, owner: Actor, resources: IResourceDictionary) {
		super(weapon.owner.ground, resources, 'projectile');
		this.sprite = new Sprite(weapon.projectileTexture);
		this.addChild(this.sprite);
		this.sprite.rotation = direction;
		this.status.speed = weapon.projectileSpeed;
		this.lifespan = weapon.projectileLifespan;
		this.damage = weapon.damage;
		this.status.moving = true;
		this.direction = direction;
		this.movable = false;
		this.hitBoxRadius = 3;
		this.hit = this.hit.bind(this);
	}

	prepare(elapsedMS: number) {
		this.calculateDestination(this.direction);
		this.lifespan = this.lifespan - elapsedMS;
	}

	act() {
		if (this.lifespan <= 0) {
			this.die();
		}
		else {
			this.move();
		}
	}

	hit(actor: Actor) {
		actor.reduceHealth(80);
		this.die();
	}
}