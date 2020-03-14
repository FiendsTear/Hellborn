// eslint-disable-next-line no-unused-vars
import Actor from './Actor';
// eslint-disable-next-line no-unused-vars
import { interaction } from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
import Projectile from './Projectile';
// eslint-disable-next-line no-unused-vars
import { Quadrant } from '../physics/Grid';
// eslint-disable-next-line no-unused-vars
import Ground from '../helpers/Ground';
import {AnimatedSprite} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import Camera from '../helpers/Camera';

	// You have a stateManagement package in the app that should be handling
	// Anything related to manipulating the game state through inputs (mouse/keyboard)
	// doesn't belong here.
interface keysDown {
	w: boolean;
	d: boolean;
	s: boolean;
	a: boolean;
	shift: boolean;
}

interface mouse {
	x: number;
	y: number;
	pressed: boolean;
}

export default class Player extends Actor {
	keysDown: keysDown;
	mouse: mouse;
	screen: PIXI.Rectangle;
	camera: Camera;
	bulletTexture: PIXI.Texture;
	weaponReady: boolean;
	reloadTime: number;
	shotSound: HTMLAudioElement;
	maxStamina: number;
	currentStamina: number;
	sprite: AnimatedSprite;

	constructor(screen: PIXI.Rectangle, camera: Camera, ground: Ground, texture: PIXI.Texture[], state: Game, quadrant: Quadrant, bulletTexture: PIXI.Texture) {
		const type = 'player';
		super(state, type, quadrant, ground);

		this.ground = ground;
		this.screen = screen;
		this.camera = camera;
		this.bulletTexture = bulletTexture;

		this.hitBoxRadius = 20;
		this.zIndex = 1;
		this.sprite = new AnimatedSprite(texture);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.sprite.animationSpeed = 0.1;
		this.addChild(this.sprite);
		this.rotation = -(Math.PI/2);

		this.centerCamera();

		this.speed = 4;
		this.rotation = -(3*Math.PI/2);
		this.interactive = true;

		this.maxHealth = 100;
		this.currentHealth = this.maxHealth;

		this.maxStamina = 100;
		this.currentStamina = this.maxStamina;
		this.camera.hud.draw();

		this.weaponReady = true;
		this.reloadTime = 0;
		this.shotSound = new Audio('./assets/sounds/shot.wav');

		this.strength = 90;
		this.movable = true;

		// I think you should move away all this logic to a class dedicated to handling input.
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		document.addEventListener('keydown', this.handleKeyPress.bind(this));

		// This doesn't belong in a Player class
		window.onresize = this.centerCamera.bind(this);
		camera.on('mousemove', this.handleMouseMove.bind(this));
		camera.on('mouseout', this.handleMouseOut.bind(this));
		camera.on('mousedown', this.handleMouseDown.bind(this));
		camera.on('mouseup', this.handleMouseUp.bind(this));

		// This doesn't belong in a Player class
		this.keysDown = {
			w: false,
			d: false,
			s: false,
			a: false,
			shift: false
		};

		// This doesn't belong in a Player class
		this.mouse = {
			x: 500,
			y: 500,
			pressed: false
		};

		this.act = this.act.bind(this);
		this.controlMovement = this.controlMovement.bind(this);
		this.centerCamera = this.centerCamera.bind(this);
	}

	prepare() {
		this.controlMovement();
		this.controlSight();
	}

	act() {
		this.move();
		this.centerCamera();
		this.reload();
		this.shoot();
	}

	// You should probably simplify this logic.
	// You are mixing up the calculation of direction and speed
	// With modifying the state (like reducing/increasing stamina)
	// this.status.moving can be simplified like this:
	//
	// const movingVertically = this.keysDown.w?!this.keysDown.s:this.keysDown.s;
	// const movingLaterally = this.keysDown.a?!this.keysDown.d:this.keysDown.d;
	// this.status.moving = movingLaterally || movingVertically;
	// 
	// and only once you've determined you're moving you should calculate direction,
	// check stamina / shift / etc.
	controlMovement() {
		let direction = 0;
		this.speed = 4;
		if (this.keysDown.shift && this.currentStamina > 0) {
			this.speed = 8;
			this.currentStamina = this.currentStamina - 1;
			this.camera.hud.draw();
		}
		if (this.currentStamina < this.maxStamina) {
			this.currentStamina = this.currentStamina + 0.1;
			this.camera.hud.draw();
		}
		this.status.moving = false;
		if (this.keysDown.w) {
			this.status.moving = true;
			direction = -Math.PI/2;
		}
		if (this.keysDown.s) {
			if (this.keysDown.w) {
				this.status.moving = false;
			}
			else {
				direction = Math.PI/2;
				this.status.moving = true;
			}
		}
		if (this.keysDown.d) {   
			if (this.keysDown.s) {
				direction = direction - Math.PI/4;
			}
			if (this.keysDown.w) {
				direction = direction + Math.PI/4;
			}
			if (!this.keysDown.s && !this.keysDown.w) {
				direction = 0;
			}
			this.status.moving = true;
		}
		if (this.keysDown.a) {
			if (this.keysDown.d) {
				this.status.moving = false;
			}
			else {
				this.status.moving = true;
				if (this.keysDown.w) {
					direction = direction - Math.PI/4;
				}
				if (this.keysDown.s) {
					direction = direction + Math.PI/4;
				}	
				if (!this.keysDown.w && !this.keysDown.s) {
					direction = Math.PI;
				}
			}
		}
		if (this.status.moving) {
			this.sprite.play();
			this.calculateDestination(direction);
		}
		else {
			this.sprite.gotoAndStop(0);
		}
	}

	controlSight() {
		const actorRelativeToCameraX = this.x + this.ground.x;
		const actorRelativeToCameraY = this.y + this.ground.y;
		let angle = Math.atan2(this.mouse.y - actorRelativeToCameraY, this.mouse.x - actorRelativeToCameraX);
		this.rotation = angle;
	}

		// This doesn't belong in a Player class
	handleKeyDown(event: KeyboardEvent) {
		if (event.code === 'KeyW') this.keysDown.w = true;
		if (event.code === 'KeyD') this.keysDown.d = true;
		if (event.code === 'KeyS') this.keysDown.s = true;
		if (event.code === 'KeyA') this.keysDown.a = true;
		if (event.shiftKey) this.keysDown.shift = true;
	}

		// This doesn't belong in a Player class
	handleKeyUp(event: KeyboardEvent) {
		if (event.code === 'KeyW') this.keysDown.w = false;
		if (event.code === 'KeyD') this.keysDown.d = false;
		if (event.code === 'KeyS') this.keysDown.s = false;
		if (event.code === 'KeyA') this.keysDown.a = false;
		if (!event.shiftKey) this.keysDown.shift = false;
	}

		// This doesn't belong in a Player class
	handleKeyPress(event: KeyboardEvent) {
		if (event.code === 'Escape') {
			this.state.pause();
		}
	}

		// This doesn't belong in a Player class
	handleMouseMove(event: interaction.InteractionEvent) {
		this.mouse.x = event.data.getLocalPosition(this.camera).x;
		this.mouse.y = event.data.getLocalPosition(this.camera).y;
	}

		// This doesn't belong in a Player class
	handleMouseOut() {
		this.state.paused = true;
	}

		// This doesn't belong in a Player class
	handleMouseDown() {
		this.mouse.pressed = true;
	}

		// This doesn't belong in a Player class
	handleMouseUp() {
		this.mouse.pressed = false;
	}

		// This doesn't belong in a Player class
	centerCamera() {
		let x = this.x - this.screen.width/2;
		let y = this.y - this.screen.height/2;
		if (this.x - this.screen.width/2 <= 0) {
			x = 0;
		}
		if (this.x + this.screen.width/2 >= this.ground.fixedWidth) {
			x = this.ground.fixedWidth - this.screen.width;
		}
		if (this.y - this.screen.height/2 <= 0) {
			y = 0;
		}
		if (this.y + this.screen.height/2 >= this.ground.fixedHeight) {
			y = this.ground.fixedHeight - this.screen.height;
		}
		this.ground.x = -x;
		this.ground.y = -y;
	}

	shoot() {
		if (this.weaponReady && this.mouse.pressed) {
			this.shotSound.play();
			const shooterFaceCenterX = this.x + this.hitBoxRadius * Math.cos(this.rotation);
			const shooterFaceCenterY = this.y + this.hitBoxRadius * Math.sin(this.rotation);
			let bulletQuadrant = this.state.grid.getQuadrantByCoords(shooterFaceCenterX, shooterFaceCenterY);
			const bullet = new Projectile(this.bulletTexture, this.state, 'projectile', bulletQuadrant, this.ground, this);
			this.ground.addChild(bullet);
			this.weaponReady = false;
			this.reloadTime = 2000;
		}
	}

	reload() {
		if (this.reloadTime >= 0) {
			this.reloadTime = this.reloadTime - this.state.ticker.elapsedMS;
		}
		else {
			this.weaponReady = true;
		}
	}
}