// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
import Ground from './Ground';
import HUD from '../Interface/HUD';
import Camera from './Camera';
import {ResourceList} from '../ResourceList';
import {Collision} from '../Physics/Collision';
import ProjectileManager from '../Actors/Projectiles/ProjectileManager';
import EnemyManager from '../Actors/Enemies/EnemyManager';
import Player from '../Actors/Player/Player';

export default class StageManager {
	paused: boolean;
	killCountGoal: number;
	ground: Ground;
	missionStarted: boolean;
	hud: HUD;
	camera: Camera;
	playerActor: Player;
	enemyManager: EnemyManager;
	projectileManager: ProjectileManager;

	constructor(private engine: Engine) {
		this.killCountGoal = 3;
		this.startMission = this.startMission.bind(this);
		this.finishMission = this.finishMission.bind(this);
		this.paused = true;
	}

	startMission() {
		this.camera = new Camera(this.engine);
		this.camera.on('mousemove', this.engine.input.handleMouseMove);
		this.camera.on('mouseout', this.engine.input.handleMouseOut);
		this.camera.on('mousedown', this.engine.input.handleMouseDown);
		this.camera.on('mouseup', this.engine.input.handleMouseUp);
		window.onresize = this.camera.centerOnPlayer.bind(this.camera);
		this.engine.stage.addChild(this.camera);

    const resourcesToLoad = [
			ResourceList['playerLegs'], 
			ResourceList['playerBody'], 
			ResourceList['wolf'], 
			ResourceList['bullet'],
			ResourceList['ground'],
			ResourceList['shot']
		];
		for (const resource of resourcesToLoad) {
			if (!this.engine.loader.resources[resource.name]) {
				this.engine.loader.add(resource.name, resource.url);
			}
		}
		this.enemyManager = new EnemyManager(this, this.engine.loader.resources);
		this.projectileManager = new ProjectileManager(this, this.engine.loader.resources);

		this.engine.loader.load(() =>  {
			// set up camera, ground, hud

			const ground = new Ground();
			this.ground = ground;
			this.camera.addChild(ground);

			this.playerActor = new Player(
				this.ground, 
				this.engine.loader.resources, 
				this.engine.input, 
				this.engine.playerManager,
				this);
			this.playerActor.id = 'player';
			this.playerActor.x = 500;
			this.playerActor.y = 1000;
			this.playerActor.destination.x = this.playerActor.x;
			this.playerActor.destination.y = this.playerActor.y;
			this.engine.stageManager.ground.addActor(this.playerActor);

			const hud = new HUD(this.playerActor, this.engine.screen);
			this.hud = hud;
			this.camera.addChild(hud);
			this.playerActor.hud = hud;
			// initialize player and enemy

			this.enemyManager.addSpawner(100, 300);
			this.enemyManager.addSpawner(500, 900);
			this.enemyManager.addSpawner(700, 500);

			// all set, go
			this.missionStarted = true;
			this.switchPause();
		});
	}

	finishMission() {
		this.hud.drawFinish();
		this.engine.menu.startMissionText.text = 'Next mission';
		this.engine.menu.startMission.y = 100;
		this.switchPause();
	}

	processMission(elapsedMS: number) {
		if (!this.paused) {
			this.playerActor.prepare(elapsedMS);
			this.enemyManager.prepare(elapsedMS);
			this.projectileManager.prepare(elapsedMS);
	
			Collision.checkCollisions(this.ground);
	
			this.playerActor.act();
			this.enemyManager.update();
			this.projectileManager.update();
			this.camera.centerOnPlayer(this.playerActor);
		}
	}

	switchPause() {
		this.paused = !this.paused;
		if (this.paused) {
			this.engine.menu.show();
		}
		else {
			this.engine.menu.hide();
		}
	}
}