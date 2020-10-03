const io = require("socket.io-client");

import * as PIXI from 'pixi.js';
import Menu from './Interface/Menu';
import Input from './Input';
import StageManager from './StageManager';
import Player from './Actors/Player/Player';

export default class Engine extends PIXI.Application {
	stageManager: StageManager;
	socket: SocketIOClient.Socket;
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
		this.socket = io("localhost:4000");
		this.socket.on('create-player', (data: any) => {
			console.log(data);
			this.stageManager.players[data.id] = new Player(
				this.stageManager.ground, 
				this.loader.resources, 
				this.input,
				this.stageManager);
			this.stageManager.players[data.id].x = 700;
			this.stageManager.players[data.id].y = 1000;
			this.stageManager.ground.addActor(this.stageManager.players[data.id]);
		});
		this.socket.on("new-place", (data:any) => {
			this.stageManager.players[data.id].x = data.x;
			this.stageManager.players[data.id].y = data.y;
		});
		this.stageManager = new StageManager(this);
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


