export default class Player {
    constructor(songTitle, previousButton, playButton, nextButton, songCurrentTime, seekBar, songTotalTime, queueContainer) {
        this.songTitle = songTitle;
        this.previousButton = previousButton;
        this.playButton = playButton;
        this.nextButton = nextButton;
        this.songCurrentTime = songCurrentTime;
        this.seekBar = seekBar;
        this.songTotalTime = songTotalTime;
        this.queueContainer = queueContainer;
        this.audio = new Audio();
        this.queue = [];
        this.queuePointer = 0;
        this.isSeeking = false;
        this.audio.addEventListener('ended', () => {
            this.handleSongEnd();
        });
        this.previousButton.addEventListener('click', () => {
            this.previousSong();
        });
        this.playButton.addEventListener('click', () => {
            if (this.audio.paused) {
                this.play();
            }
            else {
                this.pause();
            }
        });
        this.nextButton.addEventListener('click', () => {
            this.nextSong();
        });
        this.seekBar.addEventListener('input', () => {
            this.isSeeking = true;
            this.songCurrentTime.textContent = this.durationToString(Number(this.seekBar.value));
        });
        this.seekBar.addEventListener('change', () => {
            this.audio.currentTime = Number(this.seekBar.value);
            this.isSeeking = false;
        });
    }
    play() {
        this.audio.play().catch((e) => console.error(e));
        this.playButton.textContent = 'Pause';
    }
    pause() {
        this.audio.pause();
        this.playButton.textContent = 'Play';
    }
    playNewSong(song) {
        this.queue.push(song);
        this.queuePointer = this.queue.length - 1;
        this.playSong();
    }
    enqueueSong(song) {
        this.queue.push(song);
        if (this.queue.length === this.queuePointer + 1) {
            this.playSong();
        }
    }
    playSong() {
        const song = this.queue[this.queuePointer];
        this.audio.src = song.url;
        this.play();
        this.songTitle.textContent = song.name;
        this.seekBar.max = Math.max(1, Math.floor(song.duration)).toString();
        this.songTotalTime.textContent = this.durationToString(song.duration);
    }
    previousSong() {
        if (this.queuePointer > 0) {
            this.queuePointer--;
        }
        this.playSong();
    }
    nextSong() {
        if (this.queuePointer + 1 < this.queue.length) {
            this.queuePointer++;
        }
        this.playSong();
    }
    handleSongEnd() {
        this.playButton.textContent = 'Play';
        this.queuePointer++;
        if (this.queuePointer < this.queue.length) {
            this.playSong();
        }
    }
    durationToString(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    render() {
        if (!this.isSeeking) {
            this.songCurrentTime.textContent = this.durationToString(this.audio.currentTime);
            if (this.audio.ended) {
                this.seekBar.value = this.seekBar.max;
            }
            else {
                this.seekBar.value = Math.floor(this.audio.currentTime).toString();
            }
        }
        requestAnimationFrame(() => {
            this.render();
        });
    }
}
