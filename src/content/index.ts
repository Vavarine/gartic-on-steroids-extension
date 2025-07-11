const onGameInit = () => {
  const canvas = document.getElementById('canvas');

  if (!canvas) return;

  canvas.style.pointerEvents = 'auto';
  console.log('🎮 Game initialized');
}

const onRightGuess = () => {
  console.log('Right guess made');
  const canvas = document.getElementById('canvas');

  if (!canvas) return;

  const mouseUpEvent = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
    view: window
  });

  canvas.dispatchEvent(mouseUpEvent);
  canvas.style.pointerEvents = 'none';
}

const onGameEnd = () => {
  console.log('🎮 Game ended');
  const canvas = document.getElementById('canvas');

  if (!canvas) return;

  canvas.style.pointerEvents = 'auto';
}

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || typeof event.data.type !== 'string') {
    return;
  }

  switch (event.data.type) {
    case "ON_GAME_INIT":
      onGameInit();
      break;
    case "ON_RIGHT_GUESS":
      onRightGuess();
      break;
    case "ON_GAME_END":
      onGameEnd();
      break;
    default:
      console.warn('Unknown event type:', event.data.type);
  }
}, false);