import * as PIXI from 'pixi.js';
import Menu from './Interface/Menu';
import Input from './Input';
import StageManager from './StageManager';
import PlayerManager from './PlayerManager/PlayerManager';

export default class Engine extends PIXI.Application {
	stageManager: StageManager;
	playerManager: PlayerManager;
	menu: Menu;
	input: Input;

	constructor() {
		super({
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio,
			resizeTo: window
		});

		this.input = new Input(this);
		this.stageManager = new StageManager(this);
		this.playerManager = new PlayerManager(this);
		this.menu = new Menu(this);

		this.renderer.plugins.interaction.cursorStyles.sight = 'url("assets/sprites/sight.png"),auto';

		document.addEventListener('keydown', this.input.handleKeyDown);
		document.addEventListener('keyup', this.input.handleKeyUp);
	}

	launchGame() {
		this.menu.show();
		this.ticker.add(() => this.loop());
	}

	loop(): void{
		this.stageManager.processMission(this.ticker.elapsedMS);
	}
}


