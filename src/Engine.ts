import * as PIXI from 'pixi.js';

import Ground from './managers/Ground';
import {Collision} from './managers/Collision';
import Player from './actors/Player';
import ActorManager from './managers/ActorManager';
import Menu from './managers/Menu';
// eslint-disable-next-line no-unused-vars
import Camera from './managers/Camera';
import HUD from './managers/HUD';
import Input from './managers/Input';

export default class Engine extends PIXI.Application {
	audioCtx: AudioContext;
	actorManager: ActorManager;
	paused: boolean;
	menu: Menu;
	camera: Camera;
	hud: HUD;
	ground: Ground;
	input: Input;
	gameStarted: boolean;

	constructor() {
		super({
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio,
			resizeTo: window
		});
		this.paused = true;
		this.gameStarted = false;

		this.actorManager = new ActorManager(this);
		this.audioCtx = new AudioContext();
		this.input = new Input(this);
		this.renderer.plugins.interaction.cursorStyles.sight = 'url("assets/sprites/sight.png"),auto';

		document.addEventListener('keydown', this.input.handleKeyDown);
		document.addEventListener('keyup', this.input.handleKeyUp);

		this.play = this.play.bind(this);
	}

	loadResources() {
		return this.loader
			.add('playerLegs', 'assets/spritesheets/legs.json')
			.add('playerBodyRanged', 'assets/sprites/body_ranged.png')
			.add('enemy', 'assets/sprites/enemy.png')
			.add('ground', 'assets/sprites/ground.png')
			.add('wall', 'assets/sprites/wall.png')
			.add('bullet', 'assets/sprites/bullet.png')
			.add('spawner', 'assets/sprites/spawner.png')
			.add('sight', 'assets/sprites/sight.png');
	}

	initialize() {
		this.menu = new Menu(this);
		this.menu.show();

		this.ticker.add(() => this.loop());
	}

	startGame() {
		this.loadResources().load(() =>  {
			// set up camera, ground, hud
			this.camera = new Camera(this);
			this.camera.on('mousemove', this.input.handleMouseMove);
			this.camera.on('mouseout', this.input.handleMouseOut);
			this.camera.on('mousedown', this.input.handleMouseDown);
			this.camera.on('mouseup', this.input.handleMouseUp);
			window.onresize = this.camera.centerOnPlayer.bind(this.camera);
			this.stage.addChild(this.camera);

			const resources = this.loader.resources;
			const ground = new Ground();
			this.ground = ground;
			this.camera.addChild(ground);

			this.actorManager.addActor('player', 500, 500);

			const hud = new HUD(this);
			this.hud = hud;
			this.camera.addChild(hud);
			// initialize player and enemy

			this.actorManager.addActor('spawner', 100, 300);
			this.actorManager.addActor('spawner', 500, 900);
			this.actorManager.addActor('spawner', 700, 500);

			// all set, go
			this.gameStarted = true;
			this.switchPause();
		});
	}

	loop(): void{
		if (!this.paused) {
			console.log(this);
			this.play();
		}
	}
	
	play() {
		this.actorManager.prepareActors();
		Collision.checkCollisions(this.actorManager.actors, this.ground);
		this.actorManager.updateActors();
		this.camera.centerOnPlayer(this.actorManager.actors.player1 as Player);
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

	checkLevelFinish() {
		if (this.actorManager.enemiesCount === 10 && this.actorManager.enemiesAlive === 0) {
			this.hud.drawFinish();
			this.switchPause();
		}
	}
}


