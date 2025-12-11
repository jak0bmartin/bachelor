import { GameController } from './gameLogic/GameController';

function setup() {
    const controller = new GameController();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}
