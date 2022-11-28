const url = 'http://localhost:2020';
let stompClient;
let gameId;
let playerType;



function connectToSocket(gameId) {

    console.log("connecting to the game");
    let socket = new SockJS(url + "/gameplay");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
            let data = JSON.parse(response.body);
            console.log(data);
            displayResponse(data);
        })
    })
}

function connectToSocketAi(gameId) {

    console.log("connecting to the game");
    let socket = new SockJS(url + "/gameplay");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
            let data = JSON.parse(response.body);
            console.log(data);
            displayResponseAi(data);
        })
    })
}

function create_game(loginName) {
    if (loginName == null || loginName === '') {
        alert("Please enter login");
    } else {
        fetch(url + "/game/start", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                     "login": loginName
            })
        })
            .then (response => response.json())
            .then (data => {
               gameId = data.gameId;
               playerType = 'X';
               reset();
               connectToSocket(gameId);
               alert("Your created a game. Game id is: " + data.gameId);
               gameOn = true;
            })
            .catch(error => console.log(error))
    }
}

function create_gameAi(loginName) {
    if (loginName == null || loginName === '') {
        alert("Please enter login");
    } else {
        fetch(url + "/game/start", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                     "login": loginName
            })
        })
            .then (response => response.json())
            .then (data => {
               gameId = data.gameId;
               playerType = 'X';
               reset();
               gameAi = true;
//               connectToSocket(gameId);
//               alert("Your created a game. Game id is: " + data.gameId);
               gameOn = true;

            })
            .catch(error => console.log(error))
    }
}


function connectToRandom(loginName) {
    if (loginName == null || loginName === '') {
        alert("Please enter login");
    } else {
        fetch(url + "/game/connect/random", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                     "login": loginName
            })
        })
            .then(response => response.json())
            .then(data => {
            gameId = data.gameId;
                playerType = 'O';
                reset();
                connectToSocket(gameId);
                alert("Congrats you're playing with: " + data.player1.login);
            })
            .catch(error => console.log(error))
    }
}



function connectToSpecificGame() {
    let login = document.getElementById("login").value;
    if (login == null || login === '') {
        alert("Please enter login");
    } else {
        let gameId = document.getElementById("game_id").value;
        if (gameId == null || gameId === '') {
            alert("Please enter game id");
        }
        fetch(url + "/game/connect", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                 "player": {
                     "login": login
                 },
                 "gameId": gameId
            })
        })
            .then(response => response.json())
            .then(data => {
                gameId = data.gameId;
                playerType = 'O';
                reset();
                connectToSocket(gameId);
                alert("Congrats you're playing with: " + data.player1.login);
            })
            .catch(error => console.log(error))
    }
}


$("#name-play").onkeypress = function(event) {
    if(event.which == 13 || event.keyCode == 13) {
        closeModal();
        this.classList.add("hide")
        $(".game__main").classList.remove("hide");
        var loginName = $("#name-play").value;
        create_gameAi(loginName);
    }
}