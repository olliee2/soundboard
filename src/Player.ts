import type { SongFile } from './types.js';
import Selector from './Selector.js';

export default class Player {
  private audio = new Audio();
  private preloadAudio = new Audio();
  private queue: SongFile[] = [];
  private queuePointer = 0;
  private queueDuration = 0;
  private isSeeking = false;
  private draggedIndex: number | null = null;
  private selector: Selector | null = null;

  constructor(
    private songTitle: HTMLElement,
    private previousButton: HTMLButtonElement,
    private playButton: HTMLButtonElement,
    private togglePlaybackImage: HTMLImageElement,
    private nextButton: HTMLButtonElement,
    private muteButton: HTMLButtonElement,
    private muteImage: HTMLImageElement,
    private shuffleButton: HTMLButtonElement,
    private songCurrentTime: HTMLTimeElement,
    private seekBar: HTMLInputElement,
    private songTotalTime: HTMLTimeElement,
    private queueContainer: HTMLElement,
    private queueCurrentTime: HTMLTimeElement,
    private queueTotalTime: HTMLTimeElement,
    private queueRemainingTime: HTMLTimeElement,
    private queueSongsContainer: HTMLElement,
  ) {
    this.audio.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    this.previousButton.addEventListener('click', () => {
      this.previousSong();
    });

    this.playButton.addEventListener('click', () => {
      if (this.audio.paused && this.audio.src) {
        this.play();
      } else {
        this.pause();
      }
    });

    this.nextButton.addEventListener('click', () => {
      this.nextSong();
    });

    this.muteButton.addEventListener('click', () => {
      if (this.audio.muted) {
        this.audio.muted = false;
        this.muteImage.src = 'unmuted.svg';
      } else {
        this.audio.muted = true;
        this.muteImage.src = 'muted.svg';
      }
    });

    this.shuffleButton.addEventListener('click', () => {
      for (let i = 0; i < this.queue.length; i++) {
        const j = Math.floor(Math.random() * this.queue.length);
        [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
      }
      this.queuePointer = 0;
      this.renderQueue();
      this.playSong();
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

  seekForwards(time: number) {
    this.audio.currentTime += time;
  }

  getCurrentSong() {
    if (this.queuePointer < this.queue.length) {
      return this.queue[this.queuePointer];
    } else {
      return null;
    }
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
      let passedTime = this.queue
        .slice(0, this.queuePointer)
        .reduce((duration, song) => duration + song.duration, 0);
      if (!this.audio.ended) {
        passedTime += this.audio.currentTime;
      }
      this.queueCurrentTime.textContent = this.durationToString(passedTime);
      this.queueCurrentTime.dateTime = `PT${Math.floor(passedTime)}s`;
      const remainingTime = Math.ceil(this.queueDuration - passedTime);
      this.queueRemainingTime.textContent =
        this.durationToString(remainingTime);
      this.queueRemainingTime.dateTime = `PT${Math.floor(remainingTime)}S`;
    }
    requestAnimationFrame(() => {
      this.render();
    });
  }

  private play() {
    if (this.audio.src) {
      this.audio.play().catch((e) => console.error(e));
    }
    this.togglePlaybackImage.src = 'pause.svg';
  }

  private pause() {
    this.audio.pause();
    this.togglePlaybackImage.src = 'play.svg';
  }

  private playSong() {
    const song = this.queue[this.queuePointer];
    this.audio.src = song.url;
    this.play();
    this.songTitle.textContent = song.name;
    this.seekBar.max = Math.max(1, Math.floor(song.duration)).toString();
    this.songTotalTime.textContent = this.durationToString(song.duration);
    this.selector?.render();

    if (this.queuePointer + 1 < this.queue.length) {
      const nextSong = this.queue[this.queuePointer + 1];
      this.preloadAudio.src = nextSong.url;
      this.preloadAudio.load();
    }
  }

  private previousSong() {
    if (this.queuePointer > 0) {
      this.queuePointer--;
      this.renderQueue();
    }
    this.playSong();
  }

  private nextSong() {
    if (this.queuePointer + 1 < this.queue.length) {
      this.queuePointer++;
      this.renderQueue();
      this.playSong();
    } else {
      this.audio.currentTime = this.audio.duration;
    }
  }

  private handleSongEnd() {
    this.togglePlaybackImage.src = 'play.svg';
    this.queuePointer++;
    this.renderQueue();
    if (this.queuePointer < this.queue.length) {
      this.playSong();
    } else {
      this.selector?.render();
    }
  }

  private durationToString(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private renderQueue() {
    const frag = document.createDocumentFragment();
    this.queue.forEach((song, index) => {
      const div = document.createElement('div');
      div.className = 'song';
      div.dataset.index = index.toString();
      div.draggable = true;

      div.addEventListener('dragstart', () => {
        this.draggedIndex = index;
      });
      div.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      div.addEventListener('drop', (e) => {
        e.preventDefault();
        let target = e.target as HTMLElement | null;
        while (target && !target.classList.contains('song')) {
          target = target.parentElement;
        }
        if (
          target?.dataset.index !== undefined &&
          this.draggedIndex !== null &&
          this.draggedIndex !== Number(target.dataset.index)
        ) {
          this.moveSong(this.draggedIndex, Number(target.dataset.index));
        }
        this.draggedIndex = null;
      });
      div.addEventListener('dragend', () => {
        this.draggedIndex = null;
      });

      const dragIndicator = document.createElement('img');
      dragIndicator.src = 'drag-indicator.svg';
      dragIndicator.draggable = false;
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

      div.append(dragIndicator, playButton, span);
      frag.append(div);
    });
    this.queueSongsContainer.replaceChildren(frag);
    if (this.queue.length === 0) {
      this.queueContainer.classList.add('hidden');
    } else {
      this.queueContainer.classList.remove('hidden');
    }
    this.queueDuration = this.queue.reduce(
      (duration, song) => duration + song.duration,
      0,
    );
    this.queueTotalTime.textContent = this.durationToString(this.queueDuration);
    this.queueTotalTime.dateTime = `PT${Math.floor(this.queueDuration)}s`;
  }

  private moveSong(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const [moved] = this.queue.splice(fromIndex, 1);
    this.queue.splice(toIndex, 0, moved);
    if (this.queuePointer === fromIndex) {
      this.queuePointer = toIndex;
    } else if (fromIndex < this.queuePointer && toIndex >= this.queuePointer) {
      this.queuePointer--;
    } else if (fromIndex > this.queuePointer && toIndex <= this.queuePointer) {
      this.queuePointer++;
    }
    this.renderQueue();
  }
}
