import Game from './stateManagement/Game';

const game = new Game();
game.loadResources().load((loader, resources) => game.initialize(loader, resources));
document.body.appendChild(game.view);
game.ticker.add(() => game.loop());