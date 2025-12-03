import { GameController } from './game/GameController';

function setup() {
    const controller = new GameController();
    controller.start();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}
