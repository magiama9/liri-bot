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
      choices: ["Movie", "Song or Artist", "Concert", "Random"]
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
      case "Song or Artist":
        searchSpotify(noSpaces);
        break;
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

function searchSpotify(str) {
  // SPOTIFY API CALL
  // USES HIDDEN KEYS IN .ENV
  axios
    .get(`https://api.spotify.com/v1/search&q=${str}`, {
      headers: {}
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function searchConcert(str) {
  // BANDS IN TOWN API CALL
  // UTILIZES CODING BOOTCAMP APP_ID
  // STR SHOULD BE THE ARTIST NAME
  axios
    .get(
      `https://rest.bandsintown.com/artists/${str}/events?app_id=codingbootcamp`
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
      console.log(response);
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

let stripPunctuation = str => {
  let punctuation = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

  return str.replace(punctuation, "");
};

let replaceSpaces = str => {
  let spaces = /[ ]/g;
  return str.replace(spaces, "+");
};