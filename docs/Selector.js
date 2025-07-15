export default class Selector {
    constructor(filterBar, changeModeButton, changeModeImage, changeDirectionButton, changeDirectionImage, songTree, player, songJSON) {
        this.filterBar = filterBar;
        this.changeModeButton = changeModeButton;
        this.changeModeImage = changeModeImage;
        this.changeDirectionButton = changeDirectionButton;
        this.changeDirectionImage = changeDirectionImage;
        this.songTree = songTree;
        this.player = player;
        this.songJSON = songJSON;
        this.path = [];
        this.songs = [];
        this.sortMode = 'duration';
        this.sortDirection = 'ascending';
        this.debounceTimer = null;
        player.addSelector(this);
        this.songs = this.getAllSongs(songJSON);
        this.filterBar.value = '';
        this.filterBar.addEventListener('input', () => {
            if (this.debounceTimer)
                clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.render(), 150);
        });
        this.changeModeButton.addEventListener('click', () => {
            if (this.sortMode === 'duration') {
                this.sortMode = 'name';
                this.changeModeImage.src = 'alphabet.svg';
            }
            else {
                this.sortMode = 'duration';
                this.changeModeImage.src = 'time.svg';
            }
            this.render();
        });
        this.changeDirectionButton.addEventListener('click', () => {
            if (this.sortDirection === 'ascending') {
                this.sortDirection = 'descending';
                this.changeDirectionImage.src = 'arrow-down.svg';
            }
            else {
                this.sortDirection = 'ascending';
                this.changeDirectionImage.src = 'arrow-up.svg';
            }
            this.render();
        });
    }
    getAllSongs(folder) {
        let songs = folder.files;
        for (const subfolder of folder.folders) {
            songs = songs.concat(this.getAllSongs(subfolder));
        }
        return songs;
    }
    renderSongs(songs, currentSongURL, renderTimeSeparators) {
        const frag = document.createDocumentFragment();
        let previousDurationInMinutes = null;
        if (this.sortMode === 'duration') {
            songs = songs.sort((a, b) => a.duration - b.duration);
        }
        else {
            songs = songs.sort((a, b) => (a.name > b.name ? -1 : 1));
        }
        if (this.sortDirection === 'descending')
            songs.reverse();
        for (const song of songs) {
            if (this.sortMode === 'duration') {
                const durationInMinutes = Math.floor(song.duration / 60);
                if (durationInMinutes !== previousDurationInMinutes &&
                    renderTimeSeparators) {
                    previousDurationInMinutes = durationInMinutes;
                    const b = document.createElement('b');
                    b.className = 'time-separator';
                    const li = document.createElement('li');
                    b.textContent = durationInMinutes.toString();
                    li.append(b);
                    frag.append(li);
                }
            }
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.className = 'song';
            if (song.url === currentSongURL) {
                div.classList.add('active-song-selector');
            }
            const songButtonsContainer = document.createElement('div');
            songButtonsContainer.className = 'song-buttons-container';
            const playButton = document.createElement('button');
            const playIMG = document.createElement('img');
            playIMG.src = 'play.svg';
            playIMG.className = 'song-selector-image';
            playButton.append(playIMG);
            playButton.addEventListener('click', () => {
                this.player.playNewSong(song);
            });
            const queueButton = document.createElement('button');
            const queueIMG = document.createElement('img');
            queueIMG.src = 'queue.png';
            queueIMG.className = 'song-selector-image';
            queueButton.append(queueIMG);
            queueButton.addEventListener('click', () => {
                this.player.enqueueSong(song);
            });
            songButtonsContainer.append(playButton, queueButton);
            const span = document.createElement('span');
            const minutes = Math.floor(song.duration / 60);
            const seconds = song.duration % 60;
            span.textContent = `${minutes ? minutes + 'm' : ''}${seconds}s ${song.name}`;
            div.append(songButtonsContainer, span);
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
        const renderSongSeparators = index !== 0;
        const songsFragment = this.renderSongs(songFolder.files, currentSongURL, renderSongSeparators);
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
        if (this.filterBar.value === '') {
            this.songTree.replaceChildren(this.renderFolder(this.songJSON, 0, currentSongURL));
        }
        else {
            const filteredSongs = this.songs.filter((song) => {
                var _a, _b;
                return song.name
                    .toLowerCase()
                    .includes((_b = (_a = this.filterBar.value) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '');
            });
            const ul = document.createElement('ul');
            ul.append(this.renderSongs(filteredSongs, currentSongURL, true));
            this.songTree.replaceChildren(ul);
        }
    }
}
