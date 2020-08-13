// eslint-disable-next-line no-unused-vars
import {Container, Text, Graphics} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';

export default class Menu extends Container {
	startMission: Container;
	resumeMission: Container;
	graphics: Graphics;
	startMissionText: Text;

	constructor(private engine: Engine) {
		super();	
		this.interactive = true;

		this.startMission = new Container();
		this.startMissionText = new Text('New game', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
		this.startMission.addChild(this.startMissionText);
		this.startMission.interactive = true;
		this.startMission.on('click', this.engine.missionManager.startMission.bind(this.engine.missionManager));
		this.addChild(this.startMission);
		
		this.resumeMission = new Container();
		// this.resume.addChild(this.graphics);
		this.resumeMission.addChild(new Text('Resume', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'}));
		this.resumeMission.interactive = true;
		this.resumeMission.on('click', this.engine.switchPause.bind(this.engine));

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	show() {
		if (this.engine.missionManager.missionStarted) {
			this.addChild(this.resumeMission);
		}
		this.x = this.engine.screen.width/2 - this.width/2;
		this.y = this.engine.screen.height/2 - this.height/2;
		this.engine.stage.addChild(this);
	}

	hide() {
		if (this.engine.missionManager.missionStarted) {
			this.removeChild(this.resumeMission);
		}
		this.engine.stage.removeChild(this);
	}
}