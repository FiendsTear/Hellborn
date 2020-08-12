import {Container} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
// eslint-disable-next-line no-unused-vars
import HUD from '../interface/HUD';
// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';

export default class Camera extends Container {
	hud: HUD;
	screen: any;
	engine: Engine;

	constructor(engine: Engine) {
		super();
		this.engine = engine;
		this.interactive = true;
		this.cursor = 'hover';
	}

	centerOnPlayer(player: Player) {
		const screen = this.engine.screen;
		let x = player.x - screen.width/2;
		let y = player.y - screen.height/2;
		if (player.x - screen.width/2 <= 0) {
			x = 0;
		}
		if (player.x + screen.width/2 >= this.engine.ground.fixedWidth) {
			x = this.engine.ground.fixedWidth - screen.width;
		}
		if (player.y - screen.height/2 <= 0) {
			y = 0;
		}
		if (player.y + screen.height/2 >= this.engine.ground.fixedHeight) {
			y = this.engine.ground.fixedHeight - screen.height;
		}
		this.engine.ground.x = -x;
		this.engine.ground.y = -y;
	}
}