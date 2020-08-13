// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
import Ground from './Ground';
import HUD from '../Interface/HUD';
import Camera from './Camera';

export default class MissionManager {
	killCountGoal: number;
	ground: Ground;
	missionStarted: boolean;
	hud: HUD;
	camera: Camera;

	constructor(private engine: Engine) {
		this.killCountGoal = 10;
		this.startMission = this.startMission.bind(this);
		this.finishMission = this.finishMission.bind(this);
	}

	startMission() {
		this.engine.loadResources().load(() =>  {
			// set up camera, ground, hud
			this.camera = new Camera(this.engine);
			this.camera.on('mousemove', this.engine.input.handleMouseMove);
			this.camera.on('mouseout', this.engine.input.handleMouseOut);
			this.camera.on('mousedown', this.engine.input.handleMouseDown);
			this.camera.on('mouseup', this.engine.input.handleMouseUp);
			window.onresize = this.camera.centerOnPlayer.bind(this.camera);
			this.engine.stage.addChild(this.camera);

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
		this.engine.switchPause();
	}
}