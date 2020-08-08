import * as PIXI from 'pixi.js';

import Spawner from '../actors/Spawner';
import Ground from '../helpers/Ground';
import Player from '../actors/Player';
// eslint-disable-next-line no-unused-vars
import Grid, { Quadrant } from '../physics/Grid';
import ActorManager from '../actors/ActorManager';
import Menu from '../interface/Menu';
// eslint-disable-next-line no-unused-vars
import Camera from '../helpers/Camera';
import HUD from '../interface/HUD';
import Input from '../helpers/Input';

export default class Game extends PIXI.Application {
	audioCtx: AudioContext;
	actorManager: ActorManager;
	paused: boolean;
	menu: Menu;
	grid: Grid;
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
		this.renderer.plugins.interaction.cursorStyles.sight = 'url("assets/sprites/sight.png"),auto';

		this.audioCtx = new AudioContext();

		this.input = new Input(this);
		document.addEventListener('keydown', this.input.handleKeyDown);
		document.addEventListener('keyup', this.input.handleKeyUp);

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

			// initialize grid for collisions
			new Grid(ground, this);

			const playerQuadrant: Quadrant = this.grid.quadrants[4][5];
			const player = new Player(this, this, playerQuadrant, resources.bullet.texture);
			this.actorManager.addActor(player);

			const hud = new HUD(this);
			this.hud = hud;
			this.camera.addChild(hud);
			// initialize player and enemy

			const spawnerQuadrant1: Quadrant = this.grid.quadrants[4][2];
			const spawner1 = new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant1);
			this.actorManager.addActor(spawner1);
			const spawnerQuadrant2: Quadrant = this.grid.quadrants[7][2];
			const spawner2 = new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant2);
			this.actorManager.addActor(spawner2);
			const spawnerQuadrant3: Quadrant = this.grid.quadrants[7][8];
			const spawner3 = new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant3);
			this.actorManager.addActor(spawner3);

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

	addGrid(grid: Grid) {
		this.grid = grid;
	}
	
	play() {
		this.actorManager.prepareActors();
		this.grid.checkCollisions(this.actorManager.actors);
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
		if (this.actorManager.enemiesCount === 10) {
			
		}
	}
}


