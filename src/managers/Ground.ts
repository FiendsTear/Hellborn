import {Container, Sprite} from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import { Actors } from './ActorManager';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';
import {Collision, Pair} from './Collision';

export interface Quadrant {
	xIndex: number;
	yIndex: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	activeActors: string[];
}

export default class Ground extends Container {
	fixedWidth: number;
	fixedHeight: number;
	quadrants: Quadrant[][];
	horizontalCount: number;
	verticalCount: number;

	constructor() {
		super();

		this.fixedWidth = 3500;
		this.fixedHeight = 2000;
		this.zIndex = 1;

		const groundSprite = Sprite.from('ground');
		this.addChild(groundSprite);

		this.quadrants = new Array<Array<Quadrant>>();
		this.horizontalCount = 10;
		this.verticalCount = 10;

		const quadrantWidth = this.width/this.horizontalCount;
		const quadrantHeight = this.height/this.verticalCount;
		for (let i = 0; i < this.horizontalCount; i++) {
			this.quadrants[i] = [];
			const currentX = i * quadrantWidth;
			for (let j = 0; j < this.verticalCount; j++) {
				const currentY = j * quadrantHeight;
				this.quadrants[i][j] = {
					xIndex: i,
					yIndex: j,
					x1: currentX,
					y1: currentY,
					x2: currentX + quadrantWidth,
					y2: currentY + quadrantHeight,
					activeActors: []
				};
			}
		}
	}

	getQuadrantByCoords(x: number, y: number) {
		let quadrantFound = false;
		let quadrant;
		for (let i = 0, xDimenstionCount = this.quadrants.length; i < xDimenstionCount; i++) {
			if (quadrantFound) { break; }
			const xDimension = this.quadrants[i];
			for (let j = 0, yDimensionCount = xDimension.length; j < yDimensionCount; j++) {
				if (quadrantFound) { break; }
				const currentQuadrant = xDimension[j];
				if (x <= currentQuadrant.x2 &&
						x >= currentQuadrant.x1 &&
						y <= currentQuadrant.y2 &&
						y >= currentQuadrant.y1) {
					quadrantFound = true;
					quadrant = xDimension[j];
				}
					
			}
		}
		return quadrant;
	}

	calculateNewQuadrants(actor: Actor) {
		const actorRightBorder = actor.x + actor.hitBoxRadius;
		const actorLeftBorder = actor.x - actor.hitBoxRadius;
		const actorBottomBorder = actor.y + actor.hitBoxRadius;
		const actorTopBorder = actor.y - actor.hitBoxRadius;

		let currentQuadrantsClone = actor.status.quadrants.slice();
		currentQuadrantsClone.forEach((quadrant) => {
			// right
			if (actorRightBorder >= quadrant.x2) {	
				if (quadrant.xIndex + 1 < this.horizontalCount) {
					const newQuadrant = this.quadrants[quadrant.xIndex + 1][quadrant.yIndex];
					this.addActorToQuadrant(newQuadrant, actor);
					// right-bootom 
					if (actorBottomBorder >= quadrant.y2) {
						if (quadrant.yIndex + 1 < this.verticalCount) {
							const newQuadrant = this.quadrants[quadrant.xIndex + 1][quadrant.yIndex + 1];
							this.addActorToQuadrant(newQuadrant, actor);
						}
					}
					// right-top
					if (actorTopBorder <= quadrant.y1) {			
						if (quadrant.yIndex - 1 >= 0) {
							const newQuadrant = this.quadrants[quadrant.xIndex + 1][quadrant.yIndex - 1];
							this.addActorToQuadrant(newQuadrant, actor);
						}
					}
				}
			}
			// bottom
			if (actorBottomBorder >= quadrant.y2) {
				if (quadrant.yIndex + 1 < this.verticalCount) {
					const newQuadrant = this.quadrants[quadrant.xIndex][quadrant.yIndex + 1];
					this.addActorToQuadrant(newQuadrant, actor);
				}
			}
			// left
			if (actorLeftBorder <= quadrant.x1) {
				if (quadrant.xIndex - 1 >= 0) {
					const newQuadrant = this.quadrants[quadrant.xIndex - 1][quadrant.yIndex];
					this.addActorToQuadrant(newQuadrant, actor);
					// left-bottom
					if (actorBottomBorder >= quadrant.y2) {
						if (quadrant.yIndex + 1 < this.verticalCount) {
							const newQuadrant = this.quadrants[quadrant.xIndex - 1][quadrant.yIndex + 1];
							this.addActorToQuadrant(newQuadrant, actor);
						}
					}
					// left-top
					if (actorTopBorder <= quadrant.y1) {
						if (quadrant.yIndex - 1 >= 0) {
							const newQuadrant = this.quadrants[quadrant.xIndex - 1][quadrant.yIndex - 1];
							this.addActorToQuadrant(newQuadrant, actor);
						}
					}
				}
			}
			// top
			if (actorTopBorder <= quadrant.y1) {			
				if (quadrant.yIndex - 1 >= 0) {
					const newQuadrant = this.quadrants[quadrant.xIndex][quadrant.yIndex - 1];
					this.addActorToQuadrant(newQuadrant, actor);
				}
			}
		});
		currentQuadrantsClone = actor.status.quadrants.slice();
		currentQuadrantsClone.forEach((quadrant) => {
			if (actorBottomBorder < quadrant.y1 ||
					actorTopBorder > quadrant.y2 ||
					actorRightBorder < quadrant.x1 ||
					actorLeftBorder > quadrant.x2) {
				this.removeActorFromQuadrant(quadrant, actor);
			}
		});
	}

	addActorToQuadrant(quadrant: Quadrant, actor: Actor) {
		if (!quadrant.activeActors.includes(actor.id)) {
			quadrant.activeActors.push(actor.id);
		}
		const quadrantIndexInArray = this.checkQuadrantInArray(actor.status.quadrants, quadrant);
		if (quadrantIndexInArray == -1) {
			actor.status.quadrants.push(quadrant);
		}
	}

	// replace indexof with findIndex
	removeActorFromQuadrant(quadrant: Quadrant, actor: Actor) {
		quadrant.activeActors.splice( quadrant.activeActors.indexOf(actor.id), 1);
		const quadrantIndexInArray = this.checkQuadrantInArray(actor.status.quadrants, quadrant);
		actor.status.quadrants.splice(quadrantIndexInArray, 1);
	}
	
	checkQuadrantInArray(quadrants: Quadrant[], quadrant: Quadrant) {
		const quadrantIndexInArray = quadrants.findIndex((currentQuadrant) => {
			if (currentQuadrant.xIndex == quadrant.xIndex && currentQuadrant.yIndex == quadrant.yIndex) {
				return true;
			}
		});
		return quadrantIndexInArray;
	}
}