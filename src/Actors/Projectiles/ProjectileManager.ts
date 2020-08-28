import { IResourceDictionary } from 'pixi.js';
import Projectile from './Projectile';
import StageManager from '../../StageManager';
import Weapon from '../Player/Weapon';
import Actor from '../Actor';

interface Projectiles {
	[id: string]: Projectile;
}
export default class ProjectileManager {
	projectiles: Projectiles;

	constructor(private stageManager: StageManager, private resources: IResourceDictionary) {
		this.projectiles = {} as Projectiles;
	}

	addProjectile(kind: string, x: number, y: number, directon: number, source: Weapon) {
		const projectile = new Projectile(source, directon, this.resources, this.stageManager.ground);
		projectile.id = kind + Object.keys(this.projectiles).length;
		this.projectiles[projectile.id] = projectile;

		projectile.x = x;
		projectile.y = y;
		projectile.destination.x = x;
		projectile.destination.y = y;
		this.stageManager.ground.addActor(projectile);
	}

	removeProjectile(projectile: Projectile) {
		delete this.projectiles[projectile.id];
		this.stageManager.ground.removeActor(projectile);
	}

	prepare(elapsedMS: number) {
		for (const projectileID in this.projectiles) {
			this.projectiles[projectileID].prepare(elapsedMS);
		}
	}

	update() {
		for (const projectileID in this.projectiles) {
			const projectile = this.projectiles[projectileID]; 
			if (projectile.status.alive) {
				projectile.act();
			}
			else {
				this.removeProjectile(projectile);
			}
		}
	}
}