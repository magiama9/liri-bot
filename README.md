# liri-bot

Language Interpretation and Recognition Interface accessed with CLI to search Spotify, OMDB, and Bands in Town.

## About This Tool

LIRI (Language Interpretation and Recognition Interface) is a simple command line tool built using Node.js to allow a user to search for a movie, song, or band. The tool makes calls to several publicly available APIs and returns selected information to the user.

## Technical

### APIs

* Spotify -- Music search

* OMDB -- Movie Search

* Bands in Town -- Concert Search

### Node Required Modules

All required modules are included in the package.json file. Run `npm install` in your working directory to automatically pull and include any necessary modules. For Spotify API functionality on your local machine, please create a .env file with your personal Spotify access keys.

* Axios -- Node API call functionality

* Inquirer -- User prompts and user input storage

* DotEnv -- Secures API keys

* FS -- Manipulates file system

* Moment -- Handles time/date functionality