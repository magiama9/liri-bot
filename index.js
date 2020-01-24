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

let searchParam;
let userSearch;

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
      message: "What would you like to search for?",
      name: "userSearch"
    }
  ])
  .then(response => {
    // SET RESPONSES FOR MANIPULATION
    // console.log(response);
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
      // case "Artist":
      //   searchArtist(noSpaces);
      //   break;
      case "Concert":
        searchConcert(noPunc);
        break;
      // case "Random":
      //   searchRandom(noPunc);
      //   break;
      default:
        console.log("Please select a category to search.");
    }
  });

const searchTrack = str => {
  spotify
    .search({ type: "track", query: str, limit: 1 })
    .then(response => {
      // console.log(response.tracks.items);
      console.log(response.tracks.items[0].name);
      console.log(response.tracks.items[0].external_urls.spotify);
      console.log(response.tracks.items[0].album.name);
      console.log(response.tracks.items[0].album.artists[0].name);
    })
    .catch(err => {
      console.error(err);
    });
};

function searchConcert(str) {
  // BANDS IN TOWN API CALL
  // UTILIZES CODING BOOTCAMP APP_ID
  // STR SHOULD BE THE ARTIST NAME
  let currentDay = moment().format("Y-MM-DD");
  let oneWeek = addDays(currentDay);
  axios
    .get(
      `https://rest.bandsintown.com/artists/${str}/?date=${currentDay}%2C${oneWeek}/events?app_id=codingbootcamp`
    )
    .then(function(response) {
      console.log(response);
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

// function searchRandom(str) {
//   axios
//     .get("https://api.github.com/users/" + str)
//     .then(function(response) {
//       console.log(response);
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }

const addDays = str => {
  let oneWeekMoment = moment(str).add(7, "d");
  return moment(oneWeekMoment).format("Y-MM-DD");
};

const stripPunctuation = str => {
  let punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  return str.replace(punctuation, "");
};

const replaceSpaces = str => {
  let spaces = /[ ]/g;
  return str.replace(spaces, "+");
};


