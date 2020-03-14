// eslint-disable-next-line no-unused-vars
import Game, { Actors } from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';
import Collision from './Collision';

export interface Quadrant {
	xIndex: number;
	yIndex: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	activeActors: string[];
}

export interface Pair {
	firstActor: Actor;
	secondActor: Actor;
}

// This class probably belongs in stateManagement and not in Physics.
export default class Grid {
	id: string;
	quadrants: Quadrant[][];
	horizontalCount: number;
	verticalCount: number;
	constructor(ground: PIXI.Container, game: Game) {
		this.id = 'grid';
		this.quadrants = new Array<Array<Quadrant>>();
		this.horizontalCount = 10;
		this.verticalCount = 10;
		const quadrantWidth = ground.width/this.horizontalCount;
		const quadrantHeight = ground.height/this.verticalCount;
		for (let i = 0; i < this.horizontalCount; i++) {
			this.quadrants[i] = [];
			let currentX = i * quadrantWidth;
			for (let j = 0; j < this.verticalCount; j++) {
				let currentY = j * quadrantHeight;
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
		game.addGrid(this);
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

		let currentQuadrantsClone = actor.currentQuadrants.slice();
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
		currentQuadrantsClone = actor.currentQuadrants.slice();
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
		const quadrantIndexInArray = this.checkQuadrantInArray(actor.currentQuadrants, quadrant);
		if (quadrantIndexInArray == -1) {
			actor.currentQuadrants.push(quadrant);
		}
	}

	// replace indexof with findIndex
	removeActorFromQuadrant(quadrant: Quadrant, actor: Actor) {
		quadrant.activeActors.splice( quadrant.activeActors.indexOf(actor.id), 1);
		const quadrantIndexInArray = this.checkQuadrantInArray(actor.currentQuadrants, quadrant);
		actor.currentQuadrants.splice(quadrantIndexInArray, 1);
	}
	
	checkQuadrantInArray(quadrants: Quadrant[], quadrant: Quadrant) {
		let quadrantIndexInArray = quadrants.findIndex((currentQuadrant) => {
			if (currentQuadrant.xIndex == quadrant.xIndex && currentQuadrant.yIndex == quadrant.yIndex) {
				return true;
			}
		});
		return quadrantIndexInArray;
	}

	checkCollisions(actors: Actors) {
		// set up an array of quadrantIndexes to check
		let quadrants: Quadrant[] = [];
		for (var actorID in actors) {
			const actor = actors[actorID];
			actor.currentQuadrants.forEach((quadrant) => {
				if (this.checkQuadrantInArray(quadrants, quadrant) == -1) {
					quadrants.push(quadrant);
				}
			});
		}

		let pairs: Pair[] = [];
		quadrants.forEach((quadrant) => {
			if (quadrant.activeActors.length > 1) {
				for (let i = 0; i < quadrant.activeActors.length; i++) {
					const firstActorToCheck = actors[quadrant.activeActors[i]];
					if (firstActorToCheck.status.alive) {
						for (let j = i + 1; j < quadrant.activeActors.length; j++) {							
							const secondActorToCheck = actors[quadrant.activeActors[j]];
							if (secondActorToCheck.status.alive) {
								const pair = {firstActor: firstActorToCheck, secondActor: secondActorToCheck};
								if (!this.isPairCheckedForCollision(pairs, pair)) {
									pairs.push(pair);
									Collision.check(pair);
								}
							}
						}
					}
				}
			}
		});
	}

	isPairCheckedForCollision(pairs: Pair[], pair: Pair) {
		let isPairChecked = false;
		let pairIndexInArray = pairs.findIndex((currentPair) => {
			if ((currentPair.firstActor.id == pair.firstActor.id && currentPair.secondActor.id == pair.secondActor.id) ||
					(currentPair.firstActor.id == pair.secondActor.id && currentPair.secondActor.id == pair.firstActor.id)) {
				return true;
			}
		});
		if (pairIndexInArray > -1) isPairChecked = true;
		return isPairChecked;
	}
} 