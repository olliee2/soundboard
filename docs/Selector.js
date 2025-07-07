export default class Selector {
    constructor(songTree, player, songJSON) {
        this.songTree = songTree;
        this.player = player;
        this.songJSON = songJSON;
        this.path = [];
    }
    renderFolder(songFolder) {
        const ul = document.createElement('ul');
        const songs = songFolder.files.sort((a, b) => a.duration - b.duration);
        for (const song of songs) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            const minutes = Math.floor(song.duration / 60);
            const seconds = song.duration % 60;
            button.textContent = `${minutes ? minutes + 'm' : ''}${seconds}s ${song.name}`;
            button.addEventListener('click', () => {
                this.player.playNewSong(song);
            });
            li.append(button);
            ul.append(li);
        }
        const folders = songFolder.folders;
        for (const folder of folders) {
            const li = document.createElement('li');
            const span = document.createElement('span');
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
