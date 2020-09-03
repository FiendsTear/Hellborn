export class Calculations {
	static getValueCloserToMax(current: number, changeBy: number, max: number) {
		if (current < max) {
			if (max - current > changeBy) {
				current = current + changeBy;
			}
			else {
				current = max;
			}
		}
		if (current > max) {
			if (current - max > changeBy) {
				current = current - changeBy;
			}
			else {
				current = max;
			}
		}
		return current;
	}

	static rotate(currentAngle: number, rotationSpeed: number, rotateTo: number) {
		if (Math.sign(currentAngle) !== Math.sign(rotateTo)) {
			if (currentAngle > Math.PI/2 &&
					rotateTo < -Math.PI/2) {
				rotateTo = 2*Math.PI + rotateTo;
			}
			if (currentAngle < -Math.PI/2 &&
					rotateTo > Math.PI/2) {
				rotateTo = -2*Math.PI + rotateTo;
			}
		}
		currentAngle = Calculations.getValueCloserToMax(
			currentAngle, 
			rotationSpeed, 
			rotateTo);
		if (currentAngle > Math.PI) {
			currentAngle = currentAngle - 2*Math.PI;
		}
		if (currentAngle <= -Math.PI) {
			currentAngle = currentAngle + 2*Math.PI;
		}
		return currentAngle;
	}
}