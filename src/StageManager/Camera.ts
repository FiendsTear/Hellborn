import {Container} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import HUD from '../Interface/HUD';
// eslint-disable-next-line no-unused-vars
import Player from '../Actors/Player/Player';

export default class Camera extends Container {
	hud: HUD;
	screen: any;

	constructor(private engine: Engine) {
		super();
		this.interactive = true;
		this.cursor = 'sight';
	}

	centerOnPlayer(player: Player) {
		const screen = this.engine.screen;
		let x = player.x - screen.width/2;
		let y = player.y - screen.height/2;
		if (player.x - screen.width/2 <= 0) {
			x = 0;
		}
		if (player.x + screen.width/2 >= this.engine.stageManager.ground.fixedWidth) {
			x = this.engine.stageManager.ground.fixedWidth - screen.width;
		}
		if (player.y - screen.height/2 <= 0) {
			y = 0;
		}
		if (player.y + screen.height/2 >= this.engine.stageManager.ground.fixedHeight) {
			y = this.engine.stageManager.ground.fixedHeight - screen.height;
		}
		this.engine.stageManager.ground.x = -x;
		this.engine.stageManager.ground.y = -y;
	}
}