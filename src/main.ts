import type { SongFolder } from './types.js';
import Player from './Player.js';
import Selector from './Selector.js';

const JSON_URL = 'https://olliee2.github.io/audio/songs.json';

fetch(JSON_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  })
  .then((json) => {
    loadApp(json);
  });

function loadApp(songJSON: SongFolder) {
  const songTitle = document.getElementById('song-title')!;
  const previousButton = document.getElementById(
    'previous-button',
  )! as HTMLButtonElement;
  const playButton = document.getElementById(
    'play-button',
  )! as HTMLButtonElement;
  const togglePlaybackImage = document.getElementById(
    'toggle-playback',
  )! as HTMLImageElement;
  const nextButton = document.getElementById(
    'next-button',
  )! as HTMLButtonElement;
  const muteButton = document.getElementById(
    'mute-button',
  )! as HTMLButtonElement;
  const muteImage = document.getElementById('mute-image')! as HTMLImageElement;
  const shuffleButton = document.getElementById(
    'shuffle-button',
  )! as HTMLButtonElement;
  const songCurrentTime = document.getElementById(
    'song-current-time',
  )! as HTMLTimeElement;
  const seekBar = document.getElementById('seek-bar')! as HTMLInputElement;
  const songTotalTime = document.getElementById(
    'song-total-time',
  )! as HTMLTimeElement;
  const queueContainer = document.getElementById('queue-container')!;
  const queueCurrentTime = document.getElementById(
    'queue-current-time',
  )! as HTMLTimeElement;
  const queueTotalTime = document.getElementById(
    'queue-total-time',
  )! as HTMLTimeElement;
  const queueRemainingTime = document.getElementById(
    'queue-remaining-time',
  )! as HTMLTimeElement;
  const queueSongsContainer = document.getElementById('queue-songs-container')!;

  const player = new Player(
    songTitle,
    previousButton,
    playButton,
    togglePlaybackImage,
    nextButton,
    muteButton,
    muteImage,
    shuffleButton,
    songCurrentTime,
    seekBar,
    songTotalTime,
    queueContainer,
    queueCurrentTime,
    queueTotalTime,
    queueRemainingTime,
    queueSongsContainer,
  );

  player.render();

  const filterBar = document.getElementById('filter-bar')! as HTMLInputElement;
  const changeModeButton = document.getElementById(
    'change-mode-button',
  )! as HTMLButtonElement;
  const changeModeImage = document.getElementById(
    'change-mode-image',
  )! as HTMLImageElement;
  const changeDirectionButton = document.getElementById(
    'change-direction-button',
  )! as HTMLButtonElement;
  const changeDirectionImage = document.getElementById(
    'change-direction-image',
  )! as HTMLImageElement;
  const songTree = document.getElementById('song-tree')!;

  const selector = new Selector(
    filterBar,
    changeModeButton,
    changeModeImage,
    changeDirectionButton,
    changeDirectionImage,
    songTree,
    player,
    songJSON,
  );
  selector.render();

  document.addEventListener('keydown', (e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
      return;
    // Space or ; to play/pause
    // K to play previous song
    // J to play next song
    // / to highlight searchbar
    // Arrow keys to seek
    console.log(e.key.toLowerCase());
    switch (e.key.toLowerCase()) {
      case ' ':
      case ';':
        e.preventDefault();
        playButton.click();
        break;
      case 'k':
        e.preventDefault();
        previousButton.click();
        break;
      case 'l':
        e.preventDefault();
        nextButton.click();
        break;
      case 's':
        e.preventDefault();
        shuffleButton.click();
        break;
      case 'arrowright':
        e.preventDefault();
        player.seekForwards(10);
        break;
      case 'arrowleft':
        e.preventDefault();
        player.seekForwards(-10);
        break;
      case '/':
        e.preventDefault();
        filterBar.focus();
        break;
      case 'escape':
        const activeElement = document.activeElement as HTMLElement | null;
        if (activeElement) {
          activeElement.blur();
        }
        break;
    }
  });
}
