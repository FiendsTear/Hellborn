import * as PIXI from 'pixi.js';

import {Collision} from './Physics/Collision';
import Player from './ActorManager/Player';
import ActorManager from './ActorManager';
import Menu from './Interface/Menu';
import Input from './Input';
import MissionManager from './MissionManager';
import ResourceManager from './ResourceManager';

export default class Engine extends PIXI.Application {
	audioCtx: AudioContext;
	actorManager: ActorManager;
	missionManager: MissionManager;
	resourceManager: ResourceManager;
	paused: boolean;
	menu: Menu;
	input: Input;

	constructor() {
		super({
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio,
			resizeTo: window
		});
		this.paused = true;

		this.input = new Input(this);
		this.actorManager = new ActorManager(this);
		this.missionManager = new MissionManager(this);
		this.resourceManager = new ResourceManager();
		this.audioCtx = new AudioContext();
		this.menu = new Menu(this);

		this.renderer.plugins.interaction.cursorStyles.sight = 'url("assets/sprites/sight.png"),auto';

		document.addEventListener('keydown', this.input.handleKeyDown);
		document.addEventListener('keyup', this.input.handleKeyUp);

		this.play = this.play.bind(this);
	}

	launchGame() {
		this.menu.show();
		this.ticker.add(() => this.loop());
	}

	loop(): void{
		if (!this.paused) {
			console.log(this);
			this.play();
		}
	}
	
	play() {
		this.actorManager.prepareActors();
		Collision.checkCollisions(this.actorManager.actors, this.missionManager.ground);
		this.actorManager.updateActors();
		this.missionManager.camera.centerOnPlayer(this.actorManager.actors.player1 as Player);
	}

	switchPause() {
		this.paused = !this.paused;
		if (this.paused) {
			this.menu.show();
		}
		else {
			this.menu.hide();
		}
	}
}


