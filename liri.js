require("dotenv").config();

//import from keys.js
var keys = require("./keys.js")
var inquirer = require('inquirer');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);




// check the last 20 tweets
function myTweets(name) {

    if (!name) {
        userInput = "realDonaldTrump";
    } else {
        userInput = name
    }
    var params = { screen_name: userInput };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(userInput, "lastest tweets: ");
            for (var i = 0; i < 20; i++) {
                console.log((i + 1), tweets[i].text);
            }
        } else {
            return console.log('Error occurred: ' + err);
        }
    });
}



function spotifySong(song) {
    if (!song) {
        userInput = "The Sign Ace of Base";
    } else {
        userInput = song
    }
    spotify.search({ type: 'track', query: userInput }, function(err, data) {
        if (!err) {
            // console.log("displaying artist",data.artists)
            // console.log("query:\n", JSON.stringify(data, null, 2));
            console.log("Artist(s): ", data.tracks.items[0].album.artists[0].name)
            console.log("Song's Name: ", data.tracks.items[0].name);
            console.log("The preview link: ", data.tracks.items[0].preview_url);
            console.log("Album name: ", data.tracks.items[0].album.name);

        } else {
            return console.log('Error occurred: ' + err);
        }
        //adds text to log.txt

        fs.appendFile('log.txt', "\nArtist(s): " + data.tracks.items[0].album.artists[0].name + "\n", function() {});
        fs.appendFile('log.txt', "Song's Name: " + data.tracks.items[0].name + "\n", function() {});
        fs.appendFile('log.txt', "The preview link: " + data.tracks.items[0].preview_url + "\n", function() {});
        fs.appendFile('log.txt', "Album name: " + data.tracks.items[0].album.name + "\n", function() {});
    });
}

//movie-this
// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.

function movie(movie) {
    if (!movie) {
        userInput = "Mr. Nobody";
    } else {
        userInput = movie
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=40e9cece";




    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site 
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Released);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        } else {
            return console.log('Error occurred: ' + err);
        }

        //adds text to log.txt
        fs.appendFile('log.txt', "\nTitle: " + JSON.parse(body).Title + "\n", function() {});
        fs.appendFile('log.txt', "Release Year: " + JSON.parse(body).Released + "\n", function() {});
        fs.appendFile('log.txt', "IMdB Rating: " + JSON.parse(body).imdbRating + "\n", function() {});
        fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n", function() {});
        fs.appendFile('log.txt', "Country: " + JSON.parse(body).Country + "\n", function() {});
        fs.appendFile('log.txt', "Language: " + JSON.parse(body).Language + "\n", function() {});
        fs.appendFile('log.txt', "Plot: " + JSON.parse(body).Plot + "\n", function() {});
        fs.appendFile('log.txt', "Actors: " + JSON.parse(body).Actors + "\n", function() {});

    });
}


var askQuestion = function() {

    // runs inquirer and asks the user a series of questions whose replies are
    // stored within the variable answers inside of the .then statement
    inquirer.prompt([{
        name: "name",
        type: "username",
        message: "What is your name?"
    }, {
        name: "question",
        type: "list",
        message: "How can I help you today?",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
    }, ]).then(function(answers) {
        if (answers.question === "my-tweets") {
            console.log("\nHi " + answers.name)
            inquirer.prompt([{
                name: "screenName",
                type: "input",
                message: "Type the name of the person you want to check their tweets"
            }, ]).then(function(answers) {
                myTweets(answers.screenName);
            })
        } else if (answers.question === "spotify-this-song") {
            console.log("\nHi " + answers.name)
            inquirer.prompt([{
                name: "songName",
                type: "input",
                message: "What song do you want to spotify?"
            }, ]).then(function(answers) {
                spotifySong(answers.songName);
            })
        } else if (answers.question === "movie-this") {
            console.log("\nHi " + answers.name)
            inquirer.prompt([{
                name: "movieName",
                type: "input",
                message: "What movie are you looking for?"
            }, ]).then(function(answers) {
                movie(answers.movieName);
            })
        } else {
            console.log("\nHi " + answers.name)

            random();
        }

    });
}
askQuestion();