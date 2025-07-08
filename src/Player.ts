import type { SongFile } from './types.js';
import Selector from './Selector.js';

export default class Player {
  private audio = new Audio();
  private queue: SongFile[] = [];
  private queuePointer = 0;
  private isSeeking = false;
  private selector: Selector | null = null;

  constructor(
    private songTitle: HTMLElement,
    private previousButton: HTMLButtonElement,
    private playButton: HTMLButtonElement,
    private nextButton: HTMLButtonElement,
    private songCurrentTime: HTMLTimeElement,
    private seekBar: HTMLInputElement,
    private songTotalTime: HTMLTimeElement,
    private queueContainer: HTMLElement,
    private queueCurrentTime: HTMLTimeElement,
    private queueTotalTime: HTMLTimeElement,
    private queueSongsContainer: HTMLElement,
  ) {
    this.audio.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    this.previousButton.addEventListener('click', () => {
      this.previousSong();
    });

    this.playButton.addEventListener('click', () => {
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    });

    this.nextButton.addEventListener('click', () => {
      this.nextSong();
    });

    this.seekBar.addEventListener('input', () => {
      this.isSeeking = true;
      this.songCurrentTime.textContent = this.durationToString(
        Number(this.seekBar.value),
      );
    });

    this.seekBar.addEventListener('change', () => {
      this.audio.currentTime = Number(this.seekBar.value);
      this.isSeeking = false;
    });
  }

  addSelector(selector: Selector) {
    this.selector = selector;
  }

  getCurrentSong() {
    if (this.queuePointer < this.queue.length) {
      return this.queue[this.queuePointer];
    } else {
      return null;
    }
  }

  play() {
    this.audio.play().catch((e) => console.error(e));
    this.playButton.textContent = 'Pause';
  }

  pause() {
    this.audio.pause();
    this.playButton.textContent = 'Play';
  }

  playNewSong(song: SongFile) {
    this.queue = [song];
    this.queuePointer = this.queue.length - 1;
    this.playSong();
    this.renderQueue();
  }

  enqueueSong(song: SongFile) {
    this.queue.push(song);
    this.renderQueue();
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
    this.selector?.render();
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
    } else {
      this.audio.currentTime = this.audio.duration;
    }
  }

  handleSongEnd() {
    this.playButton.textContent = 'Play';
    this.queuePointer++;
    this.renderQueue();
    if (this.queuePointer < this.queue.length) {
      this.playSong();
    } else {
      this.selector?.render();
    }
  }

  durationToString(duration: number) {
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
        div.classList.add('active-song');
      }

      const playButton = document.createElement('button');
      playButton.textContent = 'Play';
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
    } else {
      this.queueContainer.classList.remove('hidden');
    }
  }

  render() {
    if (!this.isSeeking) {
      this.songCurrentTime.textContent = this.durationToString(
        this.audio.currentTime,
      );
      if (this.audio.ended) {
        this.seekBar.value = this.seekBar.max;
      } else {
        this.seekBar.value = Math.floor(this.audio.currentTime).toString();
      }
      const passedTime =
        this.queue
          .slice(0, this.queuePointer)
          .reduce((duration, song) => duration + song.duration, 0) +
        this.audio.currentTime;
      this.queueCurrentTime.textContent = this.durationToString(passedTime);
    }
    requestAnimationFrame(() => {
      this.render();
    });
  }
}
