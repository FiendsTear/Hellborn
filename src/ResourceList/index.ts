export interface Resource {
	name: string;
	url: string;
	kind: string;
}

export class ResourceList  {
	static playerLegs = {
		name: 'playerLegs',
		url: 'assets/spritesheets/legs.json',
		kind: 'spritesheet'
	};
	static playerBody = {
		name: 'playerBody',
		url: 'assets/sprites/body.png',
		kind: 'sprite'
	};
	static wolf = {
		name: 'wolf',
		url: 'assets/spritesheets/wolf.json',
		kind: 'sprite'
	};
	static ground = {
		name: 'ground',
		url: 'assets/sprites/ground.png',
		kind: 'sprite'
	};
	static bullet = {
		name: 'bullet',
		url: 'assets/sprites/bullet.png',
		kind: 'sprite'
	};
	static shot = {
		name: 'shot',
		url: './assets/sounds/shot.wav',
		kind: 'sound'
	}
}