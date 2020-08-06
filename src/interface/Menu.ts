// eslint-disable-next-line no-unused-vars
import {Container, Text, Graphics} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';

export default class Menu extends Container {
	newGame: Container;
	resume: Container;
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
		this.resume = new Container();
		// this.resume.addChild(this.graphics);
		this.resume.addChild(new Text('Resume', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'}));
		this.resume.interactive = true;
		this.resume.on('click', this.game.switchPause.bind(this.game));
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	show() {
		if (this.game.gameStarted) {
			this.addChild(this.resume);
		}
		else {
			this.addChild(this.newGame);
		}
		this.x = this.game.screen.width/2 - this.width/2;
		this.y = this.game.screen.height/2 - this.height/2;
		this.game.stage.addChild(this);
	}

	hide() {
		if (this.game.gameStarted) {
			this.removeChild(this.resume);
		}
		else {
			this.removeChild(this.newGame);
		}
		this.removeChild(this.newGame);
		this.game.stage.removeChild(this);
	}
}