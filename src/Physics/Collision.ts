import Actor from '../ActorManager/Actor';
import Ground, {Quadrant}  from '../StageManager/Ground';

export interface Pair {
	firstActor: Actor;
	secondActor: Actor;
}

export class Collision {
	static check(pair: Pair): void {
		const firstActor = pair.firstActor;
		const secondActor = pair.secondActor;
		const distance = (secondActor.destination.x - firstActor.destination.x) * (secondActor.destination.x - firstActor.destination.x) + 
			(secondActor.destination.y - firstActor.destination.y) * (secondActor.destination.y - firstActor.destination.y);
		if (distance <= (secondActor.hitBoxRadius + firstActor.hitBoxRadius)*(secondActor.hitBoxRadius + firstActor.hitBoxRadius)) {	
			this.collide(firstActor, secondActor);
		}
	}

	static collide(firstActor: Actor, secondActor: Actor) {
		if (firstActor.movable && secondActor.movable) {
			// two movable objects. one of them is gonna be pushed
			let pushingActor;
			let pushedActor;
			if (firstActor.strength >= secondActor.strength) {
				pushingActor = firstActor;
				pushedActor = secondActor;
			}
			if (firstActor.strength < secondActor.strength) {
				pushingActor = secondActor;
				pushedActor = firstActor;
			}
			// const strengthRelative = pushedActor.strength/pushingActor.strength;
			// pushedActor.speed = pushingActor.speed/(1 - strengthRelative);
			// pushingActor.speed = pushingActor.speed/strengthRelative;

			const horizontalDistanceToPushedActor = pushedActor.x - pushingActor.x;
			const verticalDistanceToPushedActor = pushedActor.y - pushingActor.y;
			const directionToPushedActor = Math.atan2(verticalDistanceToPushedActor, horizontalDistanceToPushedActor);

			const horizontalDistanceTodestinationtination = pushingActor.destination.x - pushingActor.x;
			const verticalDistanceTodestinationtination = pushingActor.destination.y - pushingActor.y;
			const directionPushingActor = Math.atan2(verticalDistanceTodestinationtination, horizontalDistanceTodestinationtination);

			if (pushingActor.status.moving) {
				pushingActor.calculateDestination(directionPushingActor);
			}
			pushedActor.calculateDestination(directionToPushedActor);
		}
		else {
			if (firstActor.kind == 'projectile' && firstActor.status.alive && secondActor.kind == 'enemy') {
				firstActor.hit(secondActor);
			}
			if (secondActor.kind == 'projectile' && secondActor.status.alive && firstActor.kind == 'enemy') {
				secondActor.hit(firstActor);
			}
		}
	}

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

	static checkCollisions(ground: Ground) {
		// set up an array of quadrantIndexes to check
		const quadrantsToCheck: Quadrant[] = [];
		ground.quadrants.forEach((row) => {
			row.forEach((quadrant) => {
				if (quadrant.activeActors.length) {
					quadrantsToCheck.push(quadrant);
				}
			});
		});

		const pairs: Pair[] = [];
		quadrantsToCheck.forEach((quadrant) => {
			if (quadrant.activeActors.length > 1) {
				for (let i = 0; i < quadrant.activeActors.length; i++) {
					const firstActorToCheck = quadrant.activeActors[i];
					if (firstActorToCheck.status.alive) {
						for (let j = i + 1; j < quadrant.activeActors.length; j++) {							
							const secondActorToCheck = quadrant.activeActors[j];
							if (secondActorToCheck.status.alive) {
								const pair = {firstActor: firstActorToCheck, secondActor: secondActorToCheck};
								if (!Collision.isPairCheckedForCollision(pairs, pair)) {

									pairs.push(pair);
									const firstActor = pair.firstActor;
									const secondActor = pair.secondActor;
									const distance = (secondActor.destination.x - firstActor.destination.x) * (secondActor.destination.x - firstActor.destination.x) + 
										(secondActor.destination.y - firstActor.destination.y) * (secondActor.destination.y - firstActor.destination.y);
									if (distance <= (secondActor.hitBoxRadius + firstActor.hitBoxRadius)*(secondActor.hitBoxRadius + firstActor.hitBoxRadius)) {	
										Collision.collide(firstActor, secondActor);
									}
								}
							}
						}
					}
				}
			}
		});
	}

}