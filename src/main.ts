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
  const nextButton = document.getElementById(
    'next-button',
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
  const queueSongsContainer = document.getElementById('queue-songs-container')!;

  const player = new Player(
    songTitle,
    previousButton,
    playButton,
    nextButton,
    songCurrentTime,
    seekBar,
    songTotalTime,
    queueContainer,
    queueCurrentTime,
    queueTotalTime,
    queueSongsContainer,
  );

  player.render();

  const songTree = document.getElementById('song-tree')!;

  const selector = new Selector(songTree, player, songJSON);
  selector.render();
}
