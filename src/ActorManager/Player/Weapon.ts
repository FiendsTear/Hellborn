// eslint-disable-next-line no-unused-vars
import Player from '.';
import Engine from '../../Engine';

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

	constructor(public owner: Player, public engine: Engine) {

		this.projectileSpeed = 25;
		this.projectileLifespan = 400;
		this.projectileTexture = this.engine.loader.resources.bullet.texture;
		this.damage = 80;
		this.ready = true;
		this.reloadTime = 0;

		const request = new XMLHttpRequest();

		request.open('GET', './assets/sounds/shot.wav', true);
		request.responseType = 'arraybuffer';

		request.onload = () => {
			const audioData = request.response;

			this.engine.audioCtx.decodeAudioData(audioData, (buffer) => {
				this.sound = buffer;
			},
			function(){ console.log('Error with decoding audio data'); });
		};
		request.send();

	}

	shoot() {
		const audioCtx = this.engine.audioCtx;

		const gainNode = audioCtx.createGain();
		gainNode.gain.value = 0.4;
		gainNode.connect(audioCtx.destination);

		const source = audioCtx.createBufferSource();
		source.buffer = this.sound;

		source.connect(gainNode);
		source.start(0);
		// this.sound.play();
		const owner = this.owner;
		const shooterFaceCenterX = owner.x + owner.hitBoxRadius * Math.cos(owner.rotation);
		const shooterFaceCenterY = owner.y + owner.hitBoxRadius * Math.sin(owner.rotation);
		const projectileDirection =  owner.body.rotation + Math.random() * Math.PI/30 - Math.PI/60;

		this.engine.actorManager.addActor('projectile', shooterFaceCenterX, shooterFaceCenterY, projectileDirection, this);
		this.ready = false;
		this.reloadTime = 500;
	}

	update() {
		if (this.reloadTime >= 0) {
			this.reloadTime = this.reloadTime - this.engine.ticker.elapsedMS;
		}
		else {
			this.ready = true;
		}
	}
}
