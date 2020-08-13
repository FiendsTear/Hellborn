// eslint-disable-next-line no-unused-vars
import Player from '../actors/Player';
// eslint-disable-next-line no-unused-vars
import Engine from '../Engine';
import {Graphics, Text, Container} from 'pixi.js';

export default class HUD extends Container {
	health: Graphics;
	stamina: Graphics;
	currencyAmountText: Text;
	finish: Text;
	player: Player;

	constructor(private engine: Engine) {
		super();
		this.player = this.engine.actorManager.actors.player1 as Player;

		this.zIndex = 10;

		this.health = new Graphics();
		this.updateHealthBar();
		this.addChild(this.health);

		this.stamina = new Graphics();
		this.updateStaminaBar();
		this.addChild(this.stamina);

		this.currencyAmountText = new Text(this.player.currencyAmount.toString(10), {fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'});
		this.currencyAmountText.x = this.engine.screen.width - 100;
		this.currencyAmountText.y = this.engine.screen.height - 100;
		this.addChild(this.currencyAmountText);

		this.finish = new Text('MISSION COMPLETE', {fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'});
		this.finish.x = this.engine.screen.width/2 - 50;
		this.finish.y = this.engine.screen.height/2 - 50;

		this.updateStaminaBar = this.updateStaminaBar.bind(this);
		this.updateHealthBar = this.updateHealthBar.bind(this);
		this.updateCurrencyAmount = this.updateCurrencyAmount.bind(this);
	}

	updateCurrencyAmount() {
		this.currencyAmountText.text = this.player.currencyAmount.toString(10);
	}

	updateHealthBar() {
		this.health.clear();
		this.health.beginFill(0x432828);
		this.health.drawRect(50, 50, 2 * this.player.maxHealth, 20);
		this.health.endFill();
		this.health.beginFill(0xDE3230);
		this.health.drawRect(50, 50, 2 * this.player.status.health, 20);
		this.health.endFill();
	}

	updateStaminaBar() {
		this.stamina.clear();
		this.stamina.beginFill(0x344543);
		this.stamina.drawRect(50, 85, 2 * this.player.maxStamina, 20);
		this.stamina.endFill();
		this.stamina.beginFill(0x33B149);
		this.stamina.drawRect(50, 85, 2 * this.player.currentStamina, 20);
		this.stamina.endFill();
	}

	drawFinish() {
		this.addChild(this.finish);
	}
}