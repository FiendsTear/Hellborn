// eslint-disable-next-line no-unused-vars
import {Container, Text, Graphics} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';

export default class Menu extends Container {
	newGame: Container;
	game: Game;
	graphics: Graphics;

	constructor(game: Game) {
		super();	
		this.game = game;
		this.interactive = true;
		this.newGame = new Container();
		this.newGame.addChild(new Text('New game', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'}));
		this.newGame.interactive = true;
		this.newGame.on('click', this.game.startGame.bind(this.game));
		this.addChild(this.newGame);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	show() {
		this.x = this.game.screen.width/2 - this.width/2;
		this.y = this.game.screen.height/2 - this.height/2;
		this.game.stage.addChild(this);
	}

	hide() {
		this.game.stage.removeChild(this);
	}
}