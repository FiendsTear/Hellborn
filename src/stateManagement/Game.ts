import * as PIXI from 'pixi.js';

import Spawner from '../actors/Spawner';
import Ground from '../helpers/Ground';
import Player from '../actors/Player';
// eslint-disable-next-line no-unused-vars
import Grid, { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';
import Menu from '../interface/Menu';
// eslint-disable-next-line no-unused-vars
import Camera from '../helpers/Camera';
import HUD from '../interface/HUD';
import Input from '../helpers/Input';

export interface Actors {
	[id: string]: Actor;
}

export default class Game extends PIXI.Application {
	// What do you use the counts for?
	paused: boolean;
	enemiesCount: number;
	playersCount: number;
	projectilesCount: number;
	spawnerCount: number;
	menu: Menu;
	grid: Grid;
	actors: Actors;
	camera: Camera;
	input: Input;

	constructor() {
		super({
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio,
			resizeTo: window
		});
		this.paused = true;
		this.enemiesCount = 0;
		this.playersCount = 0;
		this.projectilesCount = 0;
		this.spawnerCount = 0;
		this.actors = {};

		this.play = this.play.bind(this);
	}

	loadResources() {
		return this.loader
			.add('player1', 'assets/sprites/player_left_leg.png')
			.add('player2', 'assets/sprites/player_standing.png')
			.add('player3', 'assets/sprites/player_right_leg.png')
			.add('enemy', 'assets/sprites/enemy.png')
			.add('ground', 'assets/sprites/ground.png')
			.add('wall', 'assets/sprites/wall.png')
			.add('bullet', 'assets/sprites/bullet.png')
			.add('spawner', 'assets/sprites/spawner.png')
			.add('sight', 'assets/sprites/sight.png');
	}

	initialize(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
		this.renderer.plugins.interaction.cursorStyles.hover = 'url("assets/sprites/sight.png"),auto';

		this.input = new Input(this);
		document.addEventListener('keydown', this.input.handleKeyDown);
		document.addEventListener('keyup', this.input.handleKeyUp);
		document.addEventListener('keydown', this.input.handleKeyPress);

		this.camera = new Camera(this);
		window.onresize = this.camera.centerOnPlayer.bind(this);

		this.menu = new Menu(this);
		this.menu.show();

		const ground = new Ground();
		this.camera.addChild(ground);
		this.camera.ground = ground;

		const hud = new HUD(this);
		this.camera.hud = hud;
		this.camera.addChild(hud.graphics);

		this.stage.addChild(this.camera);
	
		// initialize grid for collisions
		new Grid(ground, this);
	
		// initialize player and enemy
		const playerQuadrant: Quadrant = this.grid.quadrants[4][5];
		const playerTextures = [resources.player2.texture, resources.player1.texture, resources.player2.texture, resources.player3.texture];
		const player = new Player(this, playerTextures, this, playerQuadrant, resources.bullet.texture);
		ground.addChild(player);

		const spawnerQuadrant1: Quadrant = this.grid.quadrants[4][2];
		new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant1);
		const spawnerQuadrant2: Quadrant = this.grid.quadrants[7][2];
		new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant2);
		const spawnerQuadrant3: Quadrant = this.grid.quadrants[7][8];
		new Spawner(ground, PIXI.Texture.from('enemy'), this, spawnerQuadrant3);
	}

	loop(): void{
		if (!this.paused) {
			// console.log(delta);
			this.play();
			// tick++;
		}
		else {
			// menu.manage();
		}
	}

	addGrid(grid: Grid) {
		this.grid = grid;
	}

	prepareToMoveActor(actor: Actor) {
		this.grid.calculateNewQuadrants(actor);
	}

	addActor(actor: Actor) {
		if (!this.actors[actor.id]) {
			this.actors[actor.id] = actor;
			switch(actor.type) {
			case 'enemy':
				this.enemiesCount = this.enemiesCount + 1;
				break;
			case 'player':
				this.playersCount = this.playersCount + 1;
				break;
			case 'projectile':
				this.projectilesCount = this.projectilesCount + 1;
				break;
			case 'spawner':
				this.spawnerCount = this.spawnerCount + 1;
				break;
			}
			const quadrantToAddActorTo = actor.status.quadrants[0];
			this.grid.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor.id);
		}
	}

	play() {
		// console.log(this);
		for (let actorID in this.actors) {
			if (this.actors[actorID].status.alive) {
				this.actors[actorID].prepare();
			}
		}
		this.grid.checkCollisions(this.actors);

		for (let actorID in this.actors) {
			if (this.actors[actorID].status.alive) {
				this.actors[actorID].act();
			}
		}
		this.camera.centerOnPlayer(this.actors.player1 as Player);
	}

	pause() {
		this.paused = !this.paused;
		if (this.paused) {
			this.menu.show();
		}
		else {
			this.menu.hide();
		}
	}
}


