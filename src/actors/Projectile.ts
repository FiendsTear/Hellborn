// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';
import {Sprite} from 'pixi.js';

export default class Projectile extends Actor {
	direction: number;
	lifespan: number;
	damage: number;
	sprite: Sprite;

	constructor(texture: PIXI.Texture, x: number, y: number, speed: number, lifespan: number, direction: number, damage: number, owner: Actor, kind: string) {
		super(owner.engine, kind, owner.ground, null, x, y);
		this.kind = 'projectile';
		this.sprite = new Sprite(texture);
		this.addChild(this.sprite);
		this.status.speed = speed;
		this.lifespan = lifespan;
		this.damage = damage;
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