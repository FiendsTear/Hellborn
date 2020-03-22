// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';
import {Graphics, Container} from 'pixi.js';

export default class HUD extends Container {
	graphics: Graphics;
	state: Game;

	constructor(state: Game) {
		super();
		this.state = state;
		this.graphics = new Graphics();
		this.zIndex = 10;
		this.addChild(this.graphics);
		this.draw = this.draw.bind(this);
	}

	draw() {
		this.graphics.clear();
		const player = this.state.actors.player1 as Player;
		this.graphics.beginFill(0x432828);
		this.graphics.drawRect(50, 50, 2 * player.maxHealth, 20);
		this.graphics.endFill();
		this.graphics.beginFill(0xDE3230);
		this.graphics.drawRect(50, 50, 2 * player.status.health, 20);
		this.graphics.endFill();

		this.graphics.beginFill(0x344543);
		this.graphics.drawRect(50, 85, 2 * player.maxStamina, 20);
		this.graphics.endFill();
		this.graphics.beginFill(0x33B149);
		this.graphics.drawRect(50, 85, 2 * player.currentStamina, 20);
		this.graphics.endFill();

	}
}