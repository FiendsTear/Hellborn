// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import { interaction } from 'pixi.js';

interface Keys {
	w: boolean;
	d: boolean;
	s: boolean;
	a: boolean;
	shift: boolean;
	space: boolean;
}

interface Mouse {
	x: number;
	y: number;
	pressed: boolean;
}

export default class Input {
	keys: Keys;
	mouse: Mouse;
	game: Game;

	constructor(game: Game) {
		this.game = game;
		this.mouse = {
			x: 500,
			y: 500,
			pressed: false
		};
		this.keys = {
			w: false,
			d: false,
			s: false,
			a: false,
			shift: false,
			space: false
		};
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}

	handleKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		if (event.code === 'KeyW') this.keys.w = true;
		if (event.code === 'KeyD') this.keys.d = true;
		if (event.code === 'KeyS') this.keys.s = true;
		if (event.code === 'KeyA') this.keys.a = true;
		if (event.code === 'Space') this.keys.space = true;
		if (event.shiftKey) this.keys.shift = true;
	}

	handleKeyUp(event: KeyboardEvent) {
		event.preventDefault();
		if (event.code === 'KeyW') this.keys.w = false;
		if (event.code === 'KeyD') this.keys.d = false;
		if (event.code === 'KeyS') this.keys.s = false;
		if (event.code === 'KeyA') this.keys.a = false;
		if (event.code === 'Space') this.keys.space = false;
		if (!event.shiftKey) this.keys.shift = false;
	}

	handleKeyPress(event: KeyboardEvent) {
		event.preventDefault();
		if (event.code === 'Escape') this.game.pause();
	}

	handleMouseMove(event: interaction.InteractionEvent) {
		this.mouse.x = event.data.getLocalPosition(this.game.camera).x;
		this.mouse.y = event.data.getLocalPosition(this.game.camera).y;
	}
	
	handleMouseOut() {
		this.game.paused = true;
	}

	handleMouseDown() {
		this.mouse.pressed = true;
	}
	
	handleMouseUp() {
		this.mouse.pressed = false;
	}
}