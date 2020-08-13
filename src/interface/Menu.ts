// eslint-disable-next-line no-unused-vars
import {Container, Text, Graphics} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';

export default class Menu extends Container {
	newGame: Container;
	resume: Container;
	graphics: Graphics;

	constructor(private engine: Engine) {
		super();	
		this.interactive = true;
		this.newGame = new Container();
		this.newGame.addChild(new Text('New game', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'}));
		this.newGame.interactive = true;
		this.newGame.on('click', this.engine.startGame.bind(this.engine));
		this.resume = new Container();
		// this.resume.addChild(this.graphics);
		this.resume.addChild(new Text('Resume', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'}));
		this.resume.interactive = true;
		this.resume.on('click', this.engine.switchPause.bind(this.engine));
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	show() {
		if (this.engine.gameStarted) {
			this.addChild(this.resume);
		}
		else {
			this.addChild(this.newGame);
		}
		this.x = this.engine.screen.width/2 - this.width/2;
		this.y = this.engine.screen.height/2 - this.height/2;
		this.engine.stage.addChild(this);
	}

	hide() {
		if (this.engine.gameStarted) {
			this.removeChild(this.resume);
		}
		else {
			this.removeChild(this.newGame);
		}
		this.removeChild(this.newGame);
		this.engine.stage.removeChild(this);
	}
}