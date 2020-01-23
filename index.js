/**************************************
 * *******************************
 * NODE DEPENDENCIES/REQUIREMENTS
 * *******************************
 **************************************/
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const dotenv = require("dotenv").config();
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);

inquirer
  .prompt([
    {
      // LIST OF CHOICES FOR SEARCH PARAMETERS
      type: "list",
      message: "What would you like to search for?",
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
  .then(function(response) {
    // SET RESPONSES FOR MANIPULATION
    console.log(response);
    let searchParam = response.searchParam;
    let userSearch = response.userSearch;
  });

function searchSpotify(str) {
  // SPOTIFY API CALL
  // USES HIDDEN KEYS IN .ENV
  axios
    .get("https://api.github.com/users/" + str)
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
  axios
    .get(
      "https://rest.bandsintown.com/artists/celine+dion/events?app_id=codingbootcamp" +
        str
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
  axios
    .get("http://www.omdbapi.com/?apikey=cdcc844a&t=" + str)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function searchRandom(str) {
  axios
    .get("https://api.github.com/users/" + str)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}
