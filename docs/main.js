import Player from './Player.js';
import Selector from './Selector.js';
fetch('https://olliee2.github.io/audio/songs.json')
    .then((response) => {
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    return response.json();
})
    .catch((error) => {
    if (error instanceof Error) {
        console.error(error.message);
    }
    else {
        console.error(error);
    }
})
    .then((json) => {
    loadApp(json);
});
function loadApp(songJSON) {
    const songTitle = document.getElementById('song-title');
    const previousButton = document.getElementById('previous-button');
    const playButton = document.getElementById('play-button');
    const nextButton = document.getElementById('next-button');
    const songCurrentTime = document.getElementById('song-current-time');
    const seekBar = document.getElementById('seek-bar');
    const songTotalTime = document.getElementById('song-total-time');
    const player = new Player(songTitle, previousButton, playButton, nextButton, songCurrentTime, seekBar, songTotalTime);
    player.render();
    const songTree = document.getElementById('song-tree');
    const selector = new Selector(songTree, player, songJSON);
    selector.render();
}
