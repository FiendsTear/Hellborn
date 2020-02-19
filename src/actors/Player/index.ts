import {/*move,*/ pause, addActor} from '../../stateManagement/actions/Action';
import Actor from '../Actor';;
import { interaction } from 'pixi.js';
import { customstore } from '../../stateManagement/reducers/Reducer';
import { Quadrant } from '../../physics/Grid';

interface keysDown {
	w: boolean;
	d: boolean;
	s: boolean;
	a: boolean;
}

interface mouseCoords {
	x: number;
	y: number;
}

export default class Player extends Actor {
	keysDown: keysDown;
	mouseCoords: mouseCoords;
	ground: PIXI.Container;
	screen: PIXI.Rectangle;
	camera: PIXI.Container;

	constructor(screen: PIXI.Rectangle, camera: PIXI.Container, ground: PIXI.Container, texture: PIXI.Texture, store: customstore, quadrantIndex: string) {
		const type = 'player';
		super(texture, store, type, quadrantIndex);

		this.ground = ground;
		this.screen = screen;

		this.zIndex = 1;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;

		this.centerCamera();

		this.speed = 3;
		this.rotation = -(3*Math.PI/2);
		this.interactive = true;

		this.health = 100;

		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		document.addEventListener('keydown', this.handleKeyPress.bind(this));
		window.onresize = this.centerCamera.bind(this);
		ground.on('mousemove', this.handleMouseMove.bind(this));
		camera.on('mouseout', this.handleMouseOut.bind(this));

		this.keysDown = {
			w: false,
			d: false,
			s: false,
			a: false
		};

		this.mouseCoords = {
			x: 500,
			y: 500
		};

		this.control = this.control.bind(this);
		this.controlMovement = this.controlMovement.bind(this);
		this.centerCamera = this.centerCamera.bind(this);
	}

	control() {
		this.controlMovement();
		this.controlSight();
	}

	controlMovement() {
		let direction = 0;
		this.status.moving = false;
		if (this.keysDown.w) {
			this.status.moving = true;
			direction = -Math.PI/2;
		}
		if (this.keysDown.s) {
			if (!this.status.moving) {
				direction = Math.PI/2;
				this.status.moving = true;
			}
			else this.status.moving = false;
		}
		if (this.keysDown.d) {   
			direction = direction/2;
			this.status.moving = true;
		}
		if (this.keysDown.a) {
			if (direction == 0) {
				if (this.status.moving == true) this.status.moving = false;
				else {
					direction = Math.PI;
					this.status.moving = true;
				}
			}
			else if (direction > 0) {
				direction = (direction + Math.PI)/2;
				this.status.moving = true;
			}
			else {
				direction = (direction - Math.PI)/2;
				this.status.moving = true;
			}
		}

		const horizontalSpeed = this.speed * Math.cos(direction);
		const verticalSpeed = this.speed * Math.sin(direction);

		if (this.status.moving) {
			this.move(horizontalSpeed, verticalSpeed);

			if ((this.x - screen.width/2) > 0 && (this.x + screen.width/2) < this.ground.width) {
				this.ground.x = this.ground.x - horizontalSpeed;
				this.mouseCoords.x = this.mouseCoords.x + horizontalSpeed;
			}
			if ((this.y - screen.height/2) > 0 && (this.y + screen.height/2) < this.ground.height) {
				this.ground.y = this.ground.y - verticalSpeed;
				this.mouseCoords.y = this.mouseCoords.y + verticalSpeed;
			}
		}

		// this.store.dispatch(move(this));
	}

	controlSight() {
		let angle = Math.atan((this.mouseCoords.y - this.y)/(this.mouseCoords.x - this.x));
		if (this.mouseCoords.x < this.x) {
			angle = Math.PI + angle;
		} 
		this.rotation = angle;
	}

	handleKeyDown(event: KeyboardEvent) {
		if (event.code === 'KeyW') this.keysDown.w = true;
		if (event.code === 'KeyD') this.keysDown.d = true;
		if (event.code === 'KeyS') this.keysDown.s = true;
		if (event.code === 'KeyA') this.keysDown.a = true;
	}

	handleKeyUp(event: KeyboardEvent) {
		if (event.code === 'KeyW') this.keysDown.w = false;
		if (event.code === 'KeyD') this.keysDown.d = false;
		if (event.code === 'KeyS') this.keysDown.s = false;
		if (event.code === 'KeyA') this.keysDown.a = false;
	}

	handleKeyPress(event: KeyboardEvent) {
		if (event.code === 'Escape') {
			const isPaused = !this.store.getState().pause;
			this.store.dispatch(pause(isPaused));
		}
	}

	handleMouseMove(event: interaction.InteractionEvent) {
		this.mouseCoords.x = event.data.getLocalPosition(this.ground).x;
		this.mouseCoords.y = event.data.getLocalPosition(this.ground).y;
	}

	handleMouseOut(event: interaction.InteractionEvent) {
		this.store.dispatch(pause(true));
	}

	centerCamera() {
		if (-this.x + this.screen.width/2 >= 0 || -this.x + this.screen.width/2 >= this.ground.width) {
			this.ground.x = 0;
		} else {
			this.ground.x = -this.x + this.screen.width/2;
		}
		if (-this.y + this.screen.height/2 >= 0 || -this.y + this.screen.height/2 >= this.ground.height) {
			this.ground.y = 0;
		} else {
			this.ground.y = -this.y + this.screen.height/2;
		}
	}
}