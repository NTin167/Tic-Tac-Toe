const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var turn = "";
var turns = [
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
];
var gameOn = false;
var gameAi = false;

function closeModal() {
    $(".modal").classList.add("hide-modal");
    $(".modal__overlay").classList.add("hide");
    $(".modal__body").classList.add("hide");
}
function openModal() {
    $(".modal").classList.remove("hide-modal");
    $(".modal__overlay").classList.remove("hide");
    $(".modal__body").classList.remove("hide");
}

$(".btn-play-human").onclick = function() {
    $(".game__select").classList.add("hide");
    openModal();
    console.log("openModal");
    $(".enter-name-form").classList.remove("hide");
}

$(".btn-play-ai").onclick = function() {
    $(".game__select").classList.add("hide");
    openModal();
    $(".enter-name-form").classList.remove("hide");
}

function playerTurn(turn, id) {
    if (gameOn) {
        var spotTaken = document.getElementById(id).innerText;
        if (spotTaken === "") {
            document.getElementById(id).innerText = "X"
        console.log(gameAi + " gameAi")
            if(gameAi){
                makeAMoveAi(playerType, id.split("_")[0], id.split("_")[1]);
            }
            else {
                makeAMove(playerType, id.split("_")[0], id.split("_")[1]);
            }
        }
    }
}

function makeAMove(type, xCoordinate, yCoordinate) {
    fetch(url + "/game/gameplay", {
        method: 'POST',
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify({
             "type": type,
             "coordinateX": xCoordinate,
             "coordinateY": yCoordinate,
             "gameId": gameId
        })
    })
        .then(response => response.json())
        .then(data => {
            gameOn = false;
            displayResponse(data);
        })
        .catch(error => console.log(error))
}

function makeAMoveAi(type, xCoordinate, yCoordinate) {
    fetch("http://localhost:2020/game/AIgameplay", {
        method: 'POST',
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify({
             "type": "X",
             "coordinateX": xCoordinate,
             "coordinateY": yCoordinate,
             "gameId": gameId
        })
    })
        .then(response => response.json())
        .then(data => {
            gameOn = false;
            gameAi = true;
            displayResponseAi(data);
        })
        .catch(error => console.log(error))
}

function displayResponse(data) {
    let board = data.board.square;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                turns[i][j] = 'X'
            } else if (board[i][j] === 2) {
                turns[i][j] = 'O';
            }
            let id = i + "_" + j;
            document.getElementById(id).innerText = turns[i][j];
        }
    }
    if (data.winner != null) {
        alert("Winner is " + data.winner);
        reset();
    }
    gameOn = true;
}
function displayResponseAi(data) {
    let board = data.board.square;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                turns[i][j] = 'X'
            } else if (board[i][j] === 2) {
                turns[i][j] = 'O';
            }
            let id = i + "_" + j;
            document.getElementById(id).innerText = turns[i][j];
        }
    }
    if (data.winner != null) {
        alert("Winner is " + data.winner);
        reset();
        $(".game__main").classList.add("hide");
        $(".game__select").classList.remove("hide");
    }
    gameAi = true;
    gameOn = true;
}

var tic = $$('.tic');
tic.forEach(element => {
    element.onclick = function () {
        var slot = this.getAttribute("id");
        playerTurn(turn, slot);
    }
});


function reset() {
    turns = [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
             ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];
    tic.forEach(element => {
        element.innerText = "";
    });
}
