var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const songTree = document.getElementById('song-tree');
    try {
        const response = yield fetch('songs.json');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = yield response.json();
        console.log(json);
        songTree.append(displaySongs(json));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
    }
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
}))();
export {};
