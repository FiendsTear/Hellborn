import {Container} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import HUD from '../interface/HUD';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';
// eslint-disable-next-line no-unused-vars
import Ground from './Ground';

export default class Camera extends Container {
	hud: HUD;
	game: Game;
	ground: Ground;

	constructor(game: Game) {
		super();
		this.game = game;
		this.interactive = true;
		this.cursor = 'hover';
		this.on('mousemove', game.input.handleMouseMove);
		this.on('mouseout', game.input.handleMouseOut);
		this.on('mousedown', game.input.handleMouseDown);
		this.on('mouseup', game.input.handleMouseUp);
	}

	centerOnPlayer(player: Player) {
		const screen = this.game.screen;
		let x = player.x - screen.width/2;
		let y = player.y - screen.height/2;
		if (player.x - screen.width/2 <= 0) {
			x = 0;
		}
		if (player.x + screen.width/2 >= this.ground.fixedWidth) {
			x = this.ground.fixedWidth - screen.width;
		}
		if (player.y - screen.height/2 <= 0) {
			y = 0;
		}
		if (player.y + screen.height/2 >= this.ground.fixedHeight) {
			y = this.ground.fixedHeight - screen.height;
		}
		this.ground.x = -x;
		this.ground.y = -y;
	}
}