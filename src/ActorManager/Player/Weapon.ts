// eslint-disable-next-line no-unused-vars
import Player from '.';
import ActorManager from '..';
import { IResourceDictionary, Point } from 'pixi.js';

export class Weapon {
	sound: AudioBuffer;
	ready: boolean;
	cooldown: number;
	projectileTexture: PIXI.Texture;
	projectileSpeed: number;
	projectileLifespan: number;
	damage: number;
	reloadTime: number;
	swinging: boolean;
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

		// this.engine.audioCtx.decodeAudioData(this.engine.resourceManager.resources.shot.data, (buffer) => {
		// 	this.sound = buffer;
		// })
	}

	shoot() {
		// const audioCtx = this.engine.audioCtx;

		// const gainNode = audioCtx.createGain();
		// gainNode.gain.value = 0.4;
		// gainNode.connect(audioCtx.destination);

		// const source = audioCtx.createBufferSource();
		// source.buffer = this.sound;

		// source.connect(gainNode);
		// source.start(0);
		// this.sound.play();
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
