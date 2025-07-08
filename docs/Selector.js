export default class Selector {
    constructor(songTree, player, songJSON) {
        this.songTree = songTree;
        this.player = player;
        this.songJSON = songJSON;
        this.path = [];
        player.addSelector(this);
    }
    renderSongs(songs, currentSongURL) {
        const frag = document.createDocumentFragment();
        let previousDurationInMinutes = -1;
        for (const song of songs) {
            const durationInMinutes = Math.floor(song.duration / 60);
            if (durationInMinutes > previousDurationInMinutes) {
                previousDurationInMinutes = durationInMinutes;
                const span = document.createElement('span');
                span.className = 'time-separator';
                const li = document.createElement('li');
                span.textContent = durationInMinutes.toString();
                li.append(span);
                frag.append(li);
            }
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.className = 'song';
            if (song.url === currentSongURL) {
                div.classList.add('active-song-selector');
            }
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
            const span = document.createElement('span');
            const minutes = Math.floor(song.duration / 60);
            const seconds = song.duration % 60;
            span.textContent = `${minutes ? minutes + 'm' : ''}${seconds}s ${song.name}`;
            div.append(playButton, queueButton, span);
            li.append(div);
            frag.append(li);
        }
        return frag;
    }
    renderFolders(folders, index, currentSongURL) {
        const frag = document.createDocumentFragment();
        for (const folder of folders) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'folder';
            const path = folder.name.split('/');
            button.textContent = path[path.length - 1];
            button.addEventListener('click', () => {
                const newPath = this.path.slice(0, index).concat(folder.name);
                if (newPath.length === this.path.length &&
                    newPath.every((element, index) => {
                        return element === this.path[index];
                    })) {
                    this.path = this.path.slice(0, index);
                }
                else {
                    this.path = this.path.slice(0, index).concat(folder.name);
                }
                this.render();
            });
            li.appendChild(button);
            if (index < this.path.length && folder.name === this.path[index]) {
                li.append(this.renderFolder(folder, index + 1, currentSongURL));
            }
            frag.append(li);
        }
        return frag;
    }
    renderFolder(songFolder, index, currentSongURL) {
        const ul = document.createElement('ul');
        const songs = songFolder.files.sort((a, b) => a.duration - b.duration);
        const songsFragment = this.renderSongs(songs, currentSongURL);
        const folders = songFolder.folders;
        const foldersFragment = this.renderFolders(folders, index, currentSongURL);
        if (index === 0) {
            ul.replaceChildren(songsFragment, foldersFragment);
        }
        else {
            ul.replaceChildren(foldersFragment, songsFragment);
        }
        return ul;
    }
    render() {
        var _a, _b;
        const currentSongURL = (_b = (_a = this.player.getCurrentSong()) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : null;
        this.songTree.replaceChildren(this.renderFolder(this.songJSON, 0, currentSongURL));
    }
}
