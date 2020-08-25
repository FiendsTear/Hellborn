// eslint-disable-next-line no-unused-vars
import Player from '.';
import ActorManager from '..';
import { IResourceDictionary, Point } from 'pixi.js';
import { ResourceList } from '../../ResourceList';
import Sounds from 'pixi-sound';

export class Weapon {
	sound: Sounds.Sound;
	ready: boolean;
	cooldown: number;
	projectileTexture: PIXI.Texture;
	projectileSpeed: number;
	projectileLifespan: number;
	damage: number;
	reloadTime: number;
	projectileOriginPoint: Point;

	constructor(public owner: Player, private actorManager: ActorManager, private resources: IResourceDictionary) {

		this.projectileSpeed = 25;
		this.projectileLifespan = 400;
		this.projectileTexture = this.resources.bullet.texture;
		this.damage = 80;
		this.ready = true;
		this.reloadTime = 0;
		this.projectileOriginPoint = new Point();
		this.projectileOriginPoint.x = 45;
		this.projectileOriginPoint.y = 40;

		this.sound = Sounds.add(ResourceList.shot.name, ResourceList.shot.url);
		this.sound.volume = 0.3;
	}

	shoot() {
		this.sound.play();
		const owner = this.owner;
		const shooterFaceCenterX = owner.x + this.projectileOriginPoint.x * Math.cos(owner.body.rotation);
		const shooterFaceCenterY = owner.y + this.projectileOriginPoint.y * Math.sin(owner.body.rotation);
		const projectileDirection =  owner.body.rotation + Math.random() * Math.PI/30 - Math.PI/60;

		this.actorManager.addActor('projectile', shooterFaceCenterX, shooterFaceCenterY, projectileDirection, this);
		this.ready = false;
		this.reloadTime = 500;
	}

	update(elapsedMS: number) {
		if (this.reloadTime >= 0) {
			this.reloadTime = this.reloadTime - elapsedMS;
		}
		else {
			this.ready = true;
		}
	}
}
