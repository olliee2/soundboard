// This is a module without any exports
const songTree = document.getElementById('song-tree');
fetch('https://olliee2.github.io/audio/songs.json')
    .then((response) => {
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    return response.json();
})
    .then((json) => {
    console.log(json);
    songTree.append(displaySongs(json));
})
    .catch((error) => {
    if (error instanceof Error) {
        console.error(error.message);
    }
    else {
        console.error(error);
    }
});
// Helper function to display songs
function displaySongs(json) {
    console.log(json);
    const ul = document.createElement('ul');
    const files = json.files.sort((a, b) => a.duration - b.duration);
    for (const file of files) {
        console.log(file);
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = file.url;
        const minutes = Math.floor(file.duration / 60);
        const seconds = file.duration % 60;
        a.textContent = `${minutes ? minutes + 'm' : ''}${seconds}s ${file.name}`;
        a.target = '_blank';
        li.append(a);
        ul.append(li);
    }
    const folders = json.folders;
    for (const folder of folders) {
        console.log(folder);
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = folder.name;
        li.appendChild(span);
        li.append(displaySongs(folder));
        ul.append(li);
    }
    return ul;
}
export {};
