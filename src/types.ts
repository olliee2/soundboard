export interface SongFile {
  name: string;
  url: string;
  duration: number;
}

export interface SongFolder {
  name: string;
  files: SongFile[];
  folders: SongFolder[];
}
