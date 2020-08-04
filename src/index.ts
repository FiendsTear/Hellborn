import Game from './stateManagement/Game';

const game = new Game();
document.body.appendChild(game.view);
game.initialize();