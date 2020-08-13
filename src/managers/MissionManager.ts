// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';

export default class MissionManager {
	killCountGoal: number;
	constructor(private engine: Engine) {
		this.killCountGoal = 10;
	}

	finishMission() {
		this.engine.hud.drawFinish();
		this.engine.switchPause();
	}
}