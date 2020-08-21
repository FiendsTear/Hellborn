// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
import Ground from './Ground';
import HUD from '../Interface/HUD';
import Camera from './Camera';
import {ResourceList} from '../ResourceList';

export default class StageManager {
	killCountGoal: number;
	ground: Ground;
	missionStarted: boolean;
	hud: HUD;
	camera: Camera;

	constructor(private engine: Engine) {
		this.killCountGoal = 3;

		this.camera = new Camera(this.engine);
		this.camera.on('mousemove', this.engine.input.handleMouseMove);
		this.camera.on('mouseout', this.engine.input.handleMouseOut);
		this.camera.on('mousedown', this.engine.input.handleMouseDown);
		this.camera.on('mouseup', this.engine.input.handleMouseUp);
		window.onresize = this.camera.centerOnPlayer.bind(this.camera);
		this.engine.stage.addChild(this.camera);

		this.ground = {} as Ground;
		this.startMission = this.startMission.bind(this);
		this.finishMission = this.finishMission.bind(this);
	}

	startMission() {
		this.camera.children.forEach(element => {
			if (element === this.ground) {
				this.camera.removeChild(element);
				element.destroy();
			}
		});
    const resourcesToLoad = [
			ResourceList['playerLegs'], 
			ResourceList['playerBody'], 
			ResourceList['enemy'], 
			ResourceList['bullet'],
			ResourceList['ground'],
			ResourceList['shot']
		];
		const check = this.engine.loader.add(resourcesToLoad).load(() =>  {
			// set up camera, ground, hud

			const resources = this.engine.loader.resources;
			const ground = new Ground();
			this.ground = ground;
			this.camera.addChild(ground);

			this.engine.actorManager.addActor('player', 500, 500);

			const hud = new HUD(this.engine);
			this.hud = hud;
			this.camera.addChild(hud);
			this.engine.actorManager.player.hud = hud;
			// initialize player and enemy

			this.engine.actorManager.addActor('spawner', 100, 300);
			this.engine.actorManager.addActor('spawner', 500, 900);
			this.engine.actorManager.addActor('spawner', 700, 500);

			// all set, go
			this.missionStarted = true;
			this.engine.switchPause();
		});
	}

	finishMission() {
		this.hud.drawFinish();
		this.engine.menu.startMissionText.text = 'Next mission';
		this.engine.menu.startMission.y = 100;
		this.engine.switchPause();
	}
}