/**************************************
 * *******************************
 * NODE DEPENDENCIES/REQUIREMENTS
 * *******************************
 **************************************/
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const dotenv = require("dotenv").config();
const keys = require("./keys");
const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});
/************************************************/
/*******GLOBAL VARIABLES*************************/
let searchParam; // Holds category that's searched
let userSearch; // Holds search term
let currentDay = moment().format("Y-MM-DD"); // Formats current date as YYYY-MM-DD
let oneWeek; // Holds value for one week from current moment
var commands; // Holds commands read from "./random.txt"
/************************************************/

// Reads random.txt and extracts the commands. Must be in format -- Category,"Search Term"
fs.readFile("./random.txt", "utf-8", (err, contents) => {
  commands = contents.split(",");
  if (err) {
    console.error(err);
  }
});

inquirer
  .prompt([
    {
      // LIST OF CHOICES FOR SEARCH PARAMETERS
      type: "list",
      message: "What category would you like to search?",
      name: "searchParam",
      choices: ["Movie", "Song", "Concert", "Random"]
    },
    {
      // USER INPUT TO SEARCH
      type: "input",
      message: "What term you like to search for?",
      name: "userSearch"
    }
  ])
  .then(response => {
    // SET RESPONSES FOR MANIPULATION
    searchParam = response.searchParam;
    userSearch = response.userSearch;
  })
  .then(() => {
    // DECIDES WHICH CALL TO RUN BASED ON USER DECISION
    let noPunc = stripPunctuation(userSearch);
    let noSpaces = replaceSpaces(noPunc);
    switch (searchParam) {
      case "Movie":
        if (noPunc != "") {
          searchMovie(noPunc);
        } else searchMovie("Mr. Nobody"); // Default Search if no input
        break;
      case "Song":
        if (noSpaces != "") {
          searchTrack(noSpaces);
        } else searchTrack("The Sign"); // Default search if no input
        break;
      case "Concert":
        if (noPunc != "") {
          searchConcert(noPunc);
        } else searchConcert("Celine Dion"); // Default Search if no input
        break;
      case "Random":
        // Search parameters are pulled from "./random.txt"
        userSearch = stripPunctuation(commands[1]);
        searchParam = commands[0];
        switch (searchParam) {
          case "Movie":
            searchMovie(userSearch);
            break;
          case "Song":
            searchTrack(userSearch);
            break;
          case "Concert":
            searchConcert(userSearch);
            break;
        }
        break;
      default:
        console.log("Please select a category to search.");
    }
  });

const searchTrack = str => {
  // SPOTIFY API SEARCH USING NODE SPOTIFY API WRAPPER
  spotify
    .search({ type: "track", query: str, limit: 1 }) // Limits search result to 1 for easier data handling
    .then(response => {
      console.log(`Song: ${response.tracks.items[0].name}`); // Song Name
      console.log(`Album: ${response.tracks.items[0].album.name}`); // Album Name
      console.log(`Artist: ${response.tracks.items[0].album.artists[0].name}`); // Artist Name
      console.log(
        `Spotify Link: ${response.tracks.items[0].external_urls.spotify}`
      ); // Spotify URL
    })
    .catch(err => {
      console.error(err);
    });
};

const searchConcert = str => {
  // BANDS IN TOWN API CALL
  // UTILIZES CODING BOOTCAMP APP_ID
  // STR SHOULD BE THE ARTIST NAME
  oneWeek = addDays(currentDay);
  axios
    .get(
      `https://rest.bandsintown.com/artists/${str}/events?app_id=codingbootcamp&date=${currentDay}%2C${oneWeek}` //Returns concerts within the next week
    )
    .then(response => {
      console.log(
        `${response.data[0].artist.name} will be playing at ${
          response.data[0].venue.name
        } in ${response.data[0].venue.city} on ${moment(
          response.data[0].datetime
        ).format("MM-DD-Y [@] h:mm a")}`
      ); // ${ARTIST NAME} will be playing ${VENUE NAME} in $(VENUE CITY) at ${EVENT TIME}
    })
    .catch(error => {
      console.error(error);
    });
};

const searchMovie = str => {
  // OMDB API CALL
  // PERSONAL API KEY
  axios
    .get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_apikey}&t=${str}`)
    .then(response => {
      console.log(`Title: ${response.data.Title}`); // Movie Title
      console.log(`Year: ${response.data.Year}`); // Release Year
      console.log(`IMDB Rating: ${response.data.imdbRating}`); // IMDB rating
      console.log(`RT Rating: ${response.data.Ratings[1].Value}`); // Rotten Tomatoes Rating (N.B. IF ROTTEN TOMATOES DATA IS NOT RETURNED, THIS IS USUALLY A METACRITIC SCORE)
      console.log(`Country: ${response.data.Country}`); // Production Country
      console.log(`Language: ${response.data.Language}`); // Movie Language
      console.log(`Actors: ${response.data.Actors}`); // Movie Actors
      console.log(`Plot Summary: ${response.data.Plot}`); // Movie Plot
    })
    .catch(error => {
      console.error(error);
    });
};

// Adds one week to the current day
// Used to limit concert search results to a manageable number
const addDays = str => {
  let oneWeekMoment = moment(str).add(7, "d");
  return moment(oneWeekMoment).format("Y-MM-DD");
};

// Removes punctuation for movie and concert search
const stripPunctuation = str => {
  let punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  return str.replace(punctuation, "");
};

// Replaces spaces for Spotify API search
const replaceSpaces = str => {
  let spaces = /[ ]/g;
  return str.replace(spaces, "+");
};
