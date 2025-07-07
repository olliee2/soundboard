import Player from './Player.js';
import type { SongFolder } from './types.js';

export default class Selector {
  private path = [];

  constructor(
    private songTree: HTMLElement,
    private player: Player,
    private songJSON: SongFolder,
  ) {}

  renderFolder(songFolder: SongFolder) {
    const ul = document.createElement('ul');
    const songs = songFolder.files.sort((a, b) => a.duration - b.duration);
    for (const song of songs) {
      const li = document.createElement('li');
      const div = document.createElement('div');
      div.className = 'song';
      const span = document.createElement('span');

      const minutes = Math.floor(song.duration / 60);
      const seconds = song.duration % 60;
      span.textContent = `${minutes ? minutes + 'm' : ''}${seconds}s ${song.name}`;

      const playButton = document.createElement('button');
      playButton.textContent = 'Play';
      playButton.addEventListener('click', () => {
        this.player.playNewSong(song);
      });

      const queueButton = document.createElement('button');
      queueButton.textContent = 'Enqueue';
      queueButton.addEventListener('click', () => {
        this.player.enqueueSong(song);
      });

      div.append(span, playButton, queueButton);
      li.append(div);
      ul.append(li);
    }
    const folders = songFolder.folders;
    for (const folder of folders) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.className = 'folder';
      span.textContent = folder.name;
      li.appendChild(span);
      li.append(this.renderFolder(folder));
      ul.append(li);
    }
    return ul;
  }

  render() {
    console.log(this.player, this.songJSON, this.path);
    this.songTree.replaceChildren(this.renderFolder(this.songJSON));
  }
}
