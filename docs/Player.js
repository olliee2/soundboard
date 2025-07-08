export default class Player {
    constructor(songTitle, previousButton, playButton, togglePlaybackImage, nextButton, songCurrentTime, seekBar, songTotalTime, queueContainer, queueCurrentTime, queueTotalTime, queueRemainingTime, queueSongsContainer) {
        this.songTitle = songTitle;
        this.previousButton = previousButton;
        this.playButton = playButton;
        this.togglePlaybackImage = togglePlaybackImage;
        this.nextButton = nextButton;
        this.songCurrentTime = songCurrentTime;
        this.seekBar = seekBar;
        this.songTotalTime = songTotalTime;
        this.queueContainer = queueContainer;
        this.queueCurrentTime = queueCurrentTime;
        this.queueTotalTime = queueTotalTime;
        this.queueRemainingTime = queueRemainingTime;
        this.queueSongsContainer = queueSongsContainer;
        this.audio = new Audio();
        this.queue = [];
        this.queuePointer = 0;
        this.queueDuration = 0;
        this.isSeeking = false;
        this.selector = null;
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
    addSelector(selector) {
        this.selector = selector;
    }
    getCurrentSong() {
        if (this.queuePointer < this.queue.length) {
            return this.queue[this.queuePointer];
        }
        else {
            return null;
        }
    }
    play() {
        this.audio.play().catch((e) => console.error(e));
        this.togglePlaybackImage.src = 'pause.svg';
    }
    pause() {
        this.audio.pause();
        this.togglePlaybackImage.src = 'play.svg';
    }
    playNewSong(song) {
        this.queue = [song];
        this.queuePointer = this.queue.length - 1;
        this.playSong();
        this.renderQueue();
    }
    enqueueSong(song) {
        this.queue.push(song);
        this.renderQueue();
        if (this.queue.length === this.queuePointer + 1) {
            this.playSong();
        }
    }
    playSong() {
        var _a;
        const song = this.queue[this.queuePointer];
        this.audio.src = song.url;
        this.play();
        this.songTitle.textContent = song.name;
        this.seekBar.max = Math.max(1, Math.floor(song.duration)).toString();
        this.songTotalTime.textContent = this.durationToString(song.duration);
        // what next
        (_a = this.selector) === null || _a === void 0 ? void 0 : _a.render();
    }
    previousSong() {
        if (this.queuePointer > 0) {
            this.queuePointer--;
            this.renderQueue();
        }
        this.playSong();
    }
    nextSong() {
        if (this.queuePointer + 1 < this.queue.length) {
            this.queuePointer++;
            this.renderQueue();
            this.playSong();
        }
        else {
            this.audio.currentTime = this.audio.duration;
        }
    }
    handleSongEnd() {
        var _a;
        this.togglePlaybackImage.src = 'play.svg';
        this.queuePointer++;
        this.renderQueue();
        if (this.queuePointer < this.queue.length) {
            this.playSong();
        }
        else {
            (_a = this.selector) === null || _a === void 0 ? void 0 : _a.render();
        }
    }
    durationToString(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    renderQueue() {
        const frag = document.createDocumentFragment();
        this.queue.forEach((song, index) => {
            const div = document.createElement('div');
            div.className = 'song';
            if (index === this.queuePointer) {
                div.classList.add('active-song-queue');
            }
            const playButton = document.createElement('button');
            const playImage = document.createElement('img');
            playImage.src = 'play.svg';
            playButton.append(playImage);
            playButton.addEventListener('click', () => {
                this.queuePointer = index;
                this.playSong();
                this.renderQueue();
            });
            const span = document.createElement('span');
            const minutes = Math.floor(song.duration / 60);
            const seconds = song.duration % 60;
            span.textContent = `${minutes ? minutes + 'm' : ''}${seconds}s ${song.name}`;
            div.append(playButton, span);
            frag.append(div);
        });
        this.queueSongsContainer.replaceChildren(frag);
        if (this.queue.length === 0) {
            this.queueContainer.classList.add('hidden');
        }
        else {
            this.queueContainer.classList.remove('hidden');
        }
        this.queueDuration = this.queue.reduce((duration, song) => duration + song.duration, 0);
        this.queueTotalTime.textContent = this.durationToString(this.queueDuration);
        this.queueTotalTime.dateTime = `PT${Math.floor(this.queueDuration)}s`;
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
            let passedTime = this.queue
                .slice(0, this.queuePointer)
                .reduce((duration, song) => duration + song.duration, 0);
            if (!this.audio.ended) {
                passedTime += this.audio.currentTime;
            }
            this.queueCurrentTime.textContent = this.durationToString(passedTime);
            this.queueCurrentTime.dateTime = `PT${Math.floor(passedTime)}s`;
            const remainingTime = this.queueDuration - passedTime;
            this.queueRemainingTime.textContent =
                this.durationToString(remainingTime);
            this.queueRemainingTime.dateTime = `PT${Math.floor(remainingTime)}S`;
        }
        requestAnimationFrame(() => {
            this.render();
        });
    }
}
