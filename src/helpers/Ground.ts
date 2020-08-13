import {Container, Sprite} from 'pixi.js';

export default class Ground extends Container {
	fixedWidth: number;
	fixedHeight: number;
	constructor() {
		super();

		this.fixedWidth = 3500;
		this.fixedHeight = 2000;
		this.zIndex = 1;

		const groundSprite = Sprite.from('ground');
		this.addChild(groundSprite);
	}
}