import Game from './stateManagement/Game';

const game = new Game();
game.loadResources().load(() => game.initialize());
document.body.appendChild(game.view);
game.ticker.add(() => game.loop());