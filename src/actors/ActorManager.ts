// eslint-disable-next-line no-unused-vars
import Game from '../stateManagement/Game';
// eslint-disable-next-line no-unused-vars
import Actor from '../actors/Actor';

export default class ActorManager {
	game: Game;
	constructor(game: Game) {
		this.game = game;
	}

	addActor(actor: Actor) {
		if (!this.game.actors[actor.id]) {
			this.game.actors[actor.id] = actor;
			switch(actor.type) {
			case 'enemy':
				this.game.enemiesCount = this.game.enemiesCount + 1;
				break;
			case 'player':
				this.game.playersCount = this.game.playersCount + 1;
				break;
			case 'projectile':
				this.game.projectilesCount = this.game.projectilesCount + 1;
				break;
			case 'spawner':
				this.game.spawnerCount = this.game.spawnerCount + 1;
				break;
			}
			const quadrantToAddActorTo = actor.status.quadrants[0];
			this.game.grid.quadrants[quadrantToAddActorTo.xIndex][quadrantToAddActorTo.yIndex].activeActors.push(actor.id);
		}
	}

	removeActor() {

	}
}