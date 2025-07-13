# Soundboard

## About

An online soundboard for playing .mp3, .ogg, .wav, and .flac files in the browser.

## Features

1. Nested music folders
2. Automatic sorting by song duration or name
3. Song queue creation, reordering, and playback
4. Play, pause, previous, next, mute, and shuffle controls
5. Seek bar for current song, and time display for the queue
6. Keyboard shortcut integration
7. Search bar for quickly finding specific songs
8. Song preloading for reducing stutters between tracks

## Usage & Hosting

> [!IMPORTANT]
> Due to using the .ogg file format to serve many songs, this soundboard may not work on Safari!
> If you encounter any issues, try using a different browser. Both Firefox or Chromium derivatives are officially
> supported.

1. Clone the repository:
   ```sh
    git clone https://github.com/olliee2/soundboard.git
   cd soundboard
   ```

2. Install dependencies:
    ```sh
   npm install
    ```

3. Build and run the project:
   ```sh
   npm run start
   ```
   This will start a local development server, on which you can play in your browser. This can typically be accessed
   at http://localhost:3000 but your machine may vary.

### Deploying to GitHub Pages

1. Push your repository to GitHub, making sure to have the site compiled under `/docs` by running `npm run build`
   beforehand.
2. Ensure that inside `/src/main.ts`, the constant `JSON_URL` is pointing to a valid JSON file.
3. Navigate to your repository settings, and to the Pages section.
4. Set to deploy from your `main` branch, and the `/docs` directory. Wait for GitHub to finish building the project.
5. Visit your newly deployed site!

### Hosting custom music files

Music files are hosted on the backend, which is stored as in a separate repository: https://github.com/olliee2/audio
Consult the documentation on that repository for configuring your own music to be used in the program.
