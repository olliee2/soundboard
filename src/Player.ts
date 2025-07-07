import type { SongFile } from './types.js';

export default class Player {
  private audio = new Audio();
  private queue: SongFile[] = [];
  private queuePointer = 0;

  constructor(
    private songTitle: HTMLElement,
    private previousButton: HTMLButtonElement,
    private playButton: HTMLButtonElement,
    private nextButton: HTMLButtonElement,
    private songCurrentTime: HTMLTimeElement,
    private seekBar: HTMLInputElement,
    private songTotalTime: HTMLTimeElement,
  ) {
    this.audio.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    this.playButton.addEventListener('click', () => {
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
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

  playSongAndClearQueue(song: SongFile) {
    this.queue.push(song);
    this.queuePointer = this.queue.length - 1;
    this.playSong();
  }

  enqueueSong(song: SongFile) {
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
    this.seekBar.max = Math.floor(song.duration).toString();
    this.songTotalTime.textContent = this.durationToString(song.duration);
  }

  handleSongEnd() {
    this.playButton.textContent = 'Play';
    this.queuePointer++;
    if (this.queuePointer < this.queue.length) {
      this.playSong();
    }
  }

  durationToString(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  render() {
    this.songCurrentTime.textContent = this.durationToString(
      this.audio.currentTime,
    );
    this.seekBar.value = Math.floor(this.audio.currentTime).toString();
    requestAnimationFrame(() => {
      this.render();
    });
  }
}
