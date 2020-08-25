import * as PIXI from 'pixi.js';

import {Collision} from './Physics/Collision';
import Player from './ActorManager/Player';
import ActorManager from './ActorManager';
import Menu from './Interface/Menu';
import Input from './Input';
import StageManager from './StageManager';

export default class Engine extends PIXI.Application {

	actorManager: ActorManager;
	stageManager: StageManager;
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
		this.stageManager = new StageManager(this);
		this.actorManager = new ActorManager(this.stageManager, this.loader.resources, this.input);
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
			// console.log(this);
			this.play();
		}
	}
	
	play() {
		this.actorManager.prepareActors(this.ticker.elapsedMS);
		Collision.checkCollisions(this.stageManager.ground);
		this.actorManager.updateActors();
		this.stageManager.camera.centerOnPlayer(this.stageManager.ground.player as Player);
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


