// eslint-disable-next-line no-unused-vars
import Actor from '../Actor';
import {Sprite, IResourceDictionary} from 'pixi.js';
import Weapon from '../Player/Weapon';
import ProjectileManager from './ProjectileManager';
import Ground from '../../StageManager/Ground';

export default class Projectile extends Actor {
	direction: number;
	lifespan: number;
	damage: number;
	sprite: Sprite;

	constructor(source: Weapon, direction: number, resources: IResourceDictionary, ground: Ground) {
		super(ground, resources, 'projectile');
		this.sprite = new Sprite(source.projectileTexture);
		this.addChild(this.sprite);
		this.sprite.rotation = direction;
		this.movement.currentSpeed = source.projectileSpeed;
		this.lifespan = source.projectileLifespan;
		this.damage = source.damage;
		this.status.moving = true;
		this.movement.direction = direction;
		this.hitBoxRadius = 3;
		this.hit = this.hit.bind(this);
	}

	prepare(elapsedMS: number) {
		this.calculateDestination();
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