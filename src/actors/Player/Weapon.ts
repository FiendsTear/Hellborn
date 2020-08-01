import Projectile from '../Projectile';
// eslint-disable-next-line no-unused-vars
import Player from '.';

export class Weapon {
	sound: HTMLAudioElement;
	ready: boolean;
	cooldown: number;
	projectileTexture: PIXI.Texture;
	projectileSpeed: number;
	projectileLifespan: number;
	damage: number;
	reloadTime: number;
	owner: Player;
	swinging: boolean;

	constructor(projectileTexture: PIXI.Texture, owner: Player) {
		this.owner = owner;

		this.projectileSpeed = 25;
		this.projectileLifespan = 400;
		this.projectileTexture = projectileTexture;
		this.damage = 80;
		this.ready = true;
		this.reloadTime = 0;
		this.sound = new Audio('./assets/sounds/shot.wav');
		this.sound.volume = 0.1;
		this.swinging = false;
	}

	shoot() {
		this.sound.play();
		const owner = this.owner;
		const shooterFaceCenterX = owner.x + owner.hitBoxRadius * Math.cos(owner.rotation);
		const shooterFaceCenterY = owner.y + owner.hitBoxRadius * Math.sin(owner.rotation);
		const projectileDirection =  owner.body.rotation + Math.random() * Math.PI/30 - Math.PI/60;

		const bullet = new Projectile(
			this.projectileTexture, 
			shooterFaceCenterX, 
			shooterFaceCenterY, 
			this.projectileSpeed, 
			this.projectileLifespan, 
			projectileDirection,
			this.damage,
			owner,
			'projectile'
		);
		owner.ground.addChild(bullet);
		this.ready = false;
		this.reloadTime = 2000;
	}

	update() {
		if (this.reloadTime >= 0) {
			this.reloadTime = this.reloadTime - this.owner.state.ticker.elapsedMS;
		}
		else {
			this.ready = true;
		}
	}
}