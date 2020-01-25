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
        searchMovie(noPunc);
        break;
      case "Song":
        searchTrack(noSpaces);
        break;
      case "Concert":
        searchConcert(noPunc);
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
    .search({ type: "track", query: str, limit: 1 })
    .then(response => {
      console.log(response.tracks.items[0].name); // Song Name
      console.log(response.tracks.items[0].external_urls.spotify); // Spotify URL
      console.log(response.tracks.items[0].album.name); // Album Name
      console.log(response.tracks.items[0].album.artists[0].name); // Artist Name
    })
    .catch(err => {
      console.error(err);
    });
};

function searchConcert(str) {
  // BANDS IN TOWN API CALL
  // UTILIZES CODING BOOTCAMP APP_ID
  // STR SHOULD BE THE ARTIST NAME
  oneWeek = addDays(currentDay);
  axios
    .get(
      `https://rest.bandsintown.com/artists/${str}/events?app_id=codingbootcamp&date=${currentDay}%2C${oneWeek}` //Returns concerts within the next week
    )
    .then(function(response) {
      console.log(response.data[0].venue.name); // Venue Name
      console.log(response.data[0].venue.city); // Venue City
      console.log(
        moment(response.data[0].datetime).format("MM-DD-Y [@] h:mm a")
      ); //Time/Date of Event formatted using Moment.js
    })
    .catch(function(error) {
      console.log(error);
    });
}

function searchMovie(str) {
  // OMDB API CALL
  // PERSONAL API KEY
  axios
    .get(`http://www.omdbapi.com/?apikey=cdcc844a&t=${str}`)
    .then(function(response) {
      console.log(response.data.Title); // Movie Title
      console.log(response.data.Year); // Release Year
      console.log(response.data.imdbRating); // IMDB rating
      console.log(response.data.Ratings[1].Value); // Rotten Tomatoes or Metacritic rating
      console.log(response.data.Country); // Production Country
      console.log(response.data.Language); // Movie Language
      console.log(response.data.Plot); // Movie Plot
      console.log(response.data.Actors); // Movie Actors
    })
    .catch(function(error) {
      console.log(error);
    });
}

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
