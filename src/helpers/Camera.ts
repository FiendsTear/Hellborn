import {Container} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import HUD from '../interface/HUD';
// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';

export default class Camera extends Container {
	hud: HUD;
	screen: any;
	game: Game;

	constructor(game: Game) {
		super();
		this.game = game;
		this.interactive = true;
		this.cursor = 'hover';
	}

	centerOnPlayer(player: Player) {
		const screen = this.game.screen;
		let x = player.x - screen.width/2;
		let y = player.y - screen.height/2;
		if (player.x - screen.width/2 <= 0) {
			x = 0;
		}
		if (player.x + screen.width/2 >= this.game.ground.fixedWidth) {
			x = this.game.ground.fixedWidth - screen.width;
		}
		if (player.y - screen.height/2 <= 0) {
			y = 0;
		}
		if (player.y + screen.height/2 >= this.game.ground.fixedHeight) {
			y = this.game.ground.fixedHeight - screen.height;
		}
		this.game.ground.x = -x;
		this.game.ground.y = -y;
	}
}