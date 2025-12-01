import { GAME_CONFIG, QUESTIONS } from './domain/GameConfig';
import { GameSession } from './game/GameSession';
import { UIRenderer } from './ui/domRenderer';
import { TrophyMotivator } from './ui/motivators';

function setup() {
  const questionElement = document.getElementById('question-text');
  const answersElement = document.getElementById('answers');
  const timerElement = document.getElementById('timer');
  const scoreFillElement = document.getElementById('score-fill');
  const motivatorElement = document.getElementById('motivator-text');
  const gameOverElement = document.getElementById('game-over');

  if (!questionElement || !answersElement || !timerElement || !scoreFillElement || !motivatorElement || !gameOverElement) {
    console.error('Missing one or more required DOM elements.');
    return;
  }

  const ui = new UIRenderer({
    onShowQuestion(question) {
      gameOverElement.textContent = '';
      questionElement.textContent = question.text;
      answersElement.innerHTML = '';

      question.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'answer-button';
        btn.textContent = opt.text;
        btn.onclick = () => game.answerCurrent(opt.id);
        answersElement.appendChild(btn);
      });
    },
    onUpdateTimer(seconds) {
      timerElement.textContent = `${seconds.toString()}s`;
    },
    onUpdateScore(percent) {
      scoreFillElement.style.width = `${percent}%`;
    },
    onUpdateMotivator(percent) {
      motivatorElement.textContent = `Score: ${percent.toFixed(0)}%`;
    },
    onShowGameOver(won) {
      gameOverElement.textContent = won ? 'Gewonnen! 🎉' : 'Verloren 😢';
      Array.from(answersElement.querySelectorAll('button')).forEach((b) => {
        (b as HTMLButtonElement).disabled = true;
      });
    },
  });

  const game = new GameSession({
    questions: QUESTIONS,
    config: GAME_CONFIG,
    ui,
    motivator: new TrophyMotivator(),
  });

  game.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
