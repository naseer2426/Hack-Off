const bodyParser = require("body-parser");
const cors = require("cors")({ origin: true });
const express = require("express");
const app = express();
const socket = require("socket.io");
const path = require("path");
const fs = require("fs");
var easyProblems = fs.readFileSync("easy.json");
var mediumProblems = fs.readFileSync("medium.json");
var hardProblems = fs.readFileSync("hard.json");

easyProblems = JSON.stringify(easyProblems);
mediumProblems = JSON.stringify(mediumProblems);
hardProblems = JSON.stringify(hardProblems);

app.use(cors);

var server = app.listen(8080, () => {
  console.log("Server Running...");
});

function randomGameId() {
  return Math.floor(Math.random() * 10000000);
}

var io = socket(server);
var connected_sockets = {};
var waitingList = {};
var games = {};
io.on("connection", socket => {
  console.log("New Socket connected");
  connected_sockets[socket.id] = socket;
  console.log("connected", Object.keys(connected_sockets).length);
  console.log("Running Games", Object.keys(games).length);
  socket.on("cancel_wait", () => {
    for (var i = 0; i < Object.keys(waitingList).length; i++) {
      var player2s = Object.keys(waitingList);
      if (socket.id == waitingList[player2s[i]]) {
        delete waitingList[player2s[i]];
        break;
      }
    }
    socket.emit("cancel_wait_response", { status: "Wait Cancelled" });
  });

  socket.on("problem_request", data => {
    if (data["difficulty"] == "easy") {
      var problems = Object.keys(easyProblems);
      var randomProblem =
        easyProblems[problems[Math.floor(problems.length * Math.random())]];
      socket.emit("problem_response", randomProblem);
    }
    if (data["difficulty"] == "medium") {
      var problems = Object.keys(mediumProblems);
      var randomProblem =
        mediumProblems[problems[Math.floor(problems.length * Math.random())]];
      socket.emit("problem_response", randomProblem);
    }
    if (data["difficulty"] == "hard") {
      var problems = Object.keys(hardProblems);
      var randomProblem =
        hardProblems[problems[Math.floor(problems.length * Math.random())]];
      socket.emit("problem_response", randomProblem);
    }
  });
  socket.on("join_request", data => {
    console.log("join_request");
    var player2 = data["requested"];
    var player1 = data["requester"];

    if (waitingList[player1]) {
      console.log("Its there");
      var gameId = randomGameId();

      player2Socket = connected_sockets[player1];
      player1Socket = connected_sockets[player2];

      games[gameId] = { player1: player1Socket, player2: player2Socket };
      delete waitingList[player1];
      player2Socket.emit("join_request_response", {
        status: "Ready",
        gameId: gameId
      });
      player1Socket.emit("join_request_response", {
        status: "Ready",
        gameId: gameId
      });
    } else {
      console.log("New");
      var player1Socket;
      if (connected_sockets[player2]) {
        waitingList[player2] = player1;
      }
      player1Socket = connected_sockets[player1];
      player1Socket.emit("join_request_response", { status: "Waiting" });
    }
  });

  socket.on("move", data => {
    var moveMade = data["move"];
    var gameId = data["gameId"];
    var myId = socket.id;
    // console.log(myId);
    if (games[gameId]["player1"].id == myId) {
      games[gameId]["player2"].emit("move", { move: moveMade });
    } else {
      games[gameId]["player1"].emit("move", { move: moveMade });
    }
  });

  socket.on("disconnect", () => {
    delete connected_sockets[socket.id];
    var allGames = Object.keys(games);
    for (var i = 0; i < allGames.length; i++) {
      currGame = allGames[i];
      player1 = games[currGame]["player1"];
      if (player1.id == socket.id) {
        delete games[currGame];
        break;
      }
      player2 = games[currGame]["player2"];
      if (player2.id == socket.id) {
        delete games[currGame];
        break;
      }
    }

    console.log("connected", Object.keys(connected_sockets).length);
    console.log("Running Games", Object.keys(games).length);
  });
});
