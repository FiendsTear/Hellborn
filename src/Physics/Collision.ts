import Actor from '../Actors/Actor';
import Ground, {Quadrant}  from '../StageManager/Ground';

export interface Pair {
	firstActor: Actor;
	secondActor: Actor;
}

export class Collision {
	static isPairCheckedForCollision(pairs: Pair[], pair: Pair) {
		let isPairChecked = false;
		const pairIndexInArray = pairs.findIndex((currentPair) => {
			if ((currentPair.firstActor.id == pair.firstActor.id && currentPair.secondActor.id == pair.secondActor.id) ||
					(currentPair.firstActor.id == pair.secondActor.id && currentPair.secondActor.id == pair.firstActor.id)) {
				return true;
			}
		});
		if (pairIndexInArray > -1) isPairChecked = true;
		return isPairChecked;
	}

	static collectQuadrantsToCheck(ground: Ground) {
		const quadrantsToCheck: Quadrant[] = [];
		ground.quadrants.forEach((row) => {
			row.forEach((quadrant) => {
				if (quadrant.activeActors.length > 1) {
					quadrantsToCheck.push(quadrant);
				}
			});
		});
		return quadrantsToCheck;
	}

	static checkPairs(pairs: Pair[]) {
		pairs.forEach((pair) => {
			const firstActor = pair.firstActor;
			const secondActor = pair.secondActor;
			const distance = (secondActor.destination.x - firstActor.destination.x) * (secondActor.destination.x - firstActor.destination.x) + 
				(secondActor.destination.y - firstActor.destination.y) * (secondActor.destination.y - firstActor.destination.y);
			if (distance <= (secondActor.hitBoxRadius + firstActor.hitBoxRadius)*(secondActor.hitBoxRadius + firstActor.hitBoxRadius)) {	
				firstActor.collidedWith.push(secondActor);
				secondActor.collidedWith.push(firstActor);
			}
		});
	}

	static checkCollisions(ground: Ground) {
		const quadrantsToCheck = Collision.collectQuadrantsToCheck(ground);

		const pairs: Pair[] = [];
		quadrantsToCheck.forEach((quadrant) => {
			for (let i = 0; i < quadrant.activeActors.length; i++) {
				const firstActorToCheck = quadrant.activeActors[i];
				for (let j = i + 1; j < quadrant.activeActors.length; j++) {							
					const secondActorToCheck = quadrant.activeActors[j];
					const pair = {firstActor: firstActorToCheck, secondActor: secondActorToCheck};
					if (!Collision.isPairCheckedForCollision(pairs, pair)) {
						pairs.push(pair);
					}
				}
			}
		});
		Collision.checkPairs(pairs);
	}

}