const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
console.log("hello")
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
var ts = [
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
    if($(".user-ele").classList.contains("hide")){
        openModal();
        $(".enter-name-form").classList.remove("hide");
    }else {
        var loginName = $(".user-name").innerText;
        $(".game__main").classList.remove("hide");
        create_gameAi(loginName);
    }
}

$(".btn-playing").onclick = function() {
    reset();
    closeModal();
    $(".mark-form").classList.add("hide")
    $(".game__main").classList.remove("hide");
//    var loginName = $("#name-play").value;
    var loginName = $(".user-name").innerText;
    create_gameAi(loginName);
}

$(".btn-exit").onclick = function() {
    reset();
    closeModal();
    $(".mark-form").classList.add("hide")
    $(".game__main").classList.add("hide");
    $(".game__select").classList.remove("hide");
}


function playerTurn(turn, id) {
    if (gameOn) {
        var spotTaken = document.getElementById(id).innerText;
        if (spotTaken === "") {
        tic.forEach(element => {
            element.onclick = function () {
                console.log("no click")
            }
        });
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                document.getElementById(i + "_" + j).classList.remove("strong");
                console.log("remove claas strong")
            }
        }
        document.getElementById(id).innerText = "X";
        console.log("gameAi: " + gameAi)
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
                turns[i][j] = 'X';
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
    let winner = data.winner;
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            ts[i][j] = turns[i][j];
        }
    }
    console.log(ts);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                turns[i][j] = 'X';
                document.getElementById(i + "_" + j).classList.add("x");
                document.getElementById(i + "_" + j).classList.add("no-hover");
                document.getElementById(i + "_" + j).innerText = 'X';
            } else if (board[i][j] === 2) {
                turns[i][j] = 'O';
                document.getElementById(i + "_" + j).classList.add("o");
                document.getElementById(i + "_" + j).classList.add("no-hover");
                document.getElementById(i + "_" + j).innerText = 'O';
            }
        }
    }
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if(ts[i][j] != turns[i][j] && turns[i][j] === 'O') {
                let idtemp = i + "_" + j;
                console.log(idtemp);
                let z = document.getElementById(idtemp);
                z.classList.add("strong");
                console.log(z);
//                let z = document.getElementById(i + "_" + j);
//                z.setAttribute("style", "background-color:blue");
            }
        }
    }
    if (winner != null) {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                let id = i + "_" + j;
                document.getElementById(i + "_" + j).classList.remove("no-hover");
                document.getElementById(id).innerText = turns[i][j];
            }
        }
        let wins = [];
        findWin(turns, wins, winner);
        setTimeout(() =>{
            openModal();
            $(".mark-form").classList.remove("hide");
            if(winner === "X") {
                $(".label-win").classList.remove("hide");
                $(".label-lose").classList.add("hide");
            }
            else {
                $(".label-win").classList.add("hide");
                $(".label-lose").classList.remove("hide");
            }
    }, 1000)
    }
    gameAi = true;
    gameOn = true;
    tic.forEach(element => {
        element.onclick = function () {
            var slot = this.getAttribute("id");
            playerTurn(turn, slot);
        }
    });
}

var tic = $$('.tic');
tic.forEach(element => {
    element.onclick = function () {
        var slot = this.getAttribute("id");
        playerTurn(turn, slot);
    }
});

function findWin (turns, wins, winner) {
    findWinLoop: for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if(winner === "X") {
                if (turns[i][j] === "X" && turns[i][j] === turns[i][j+1] && turns[i][j] === turns[i][j+2] && turns[i][j] === turns[i][j+3] && turns[i][j] === turns[i][j+4]) {
                    wins.push(i + "_" + j);
                    wins.push(i + "_" + (j+1));
                    wins.push(i + "_" + (j+2));
                    wins.push(i + "_" + (j+3));
                    wins.push(i + "_" + (j+4));
                    break findWinLoop;
                }
                if (turns[i][j] === "X" && turns[i][j] === turns[i+1][j] && turns[i][j] === turns[i+2][j] && turns[i][j] === turns[i+3][j] && turns[i][j] === turns[i+4][j]) {
                    wins.push(i + "_" + j);
                    wins.push((i+1) + "_" + j);
                    wins.push((i+2) + "_" + j);
                    wins.push((i+3) + "_" + j);
                    wins.push((i+4) + "_" + j);
                    break findWinLoop;
                }
                if (turns[i][j] === "X" && turns[i][j] === turns[i+1][j+1] && turns[i][j] === turns[i+2][j+2] && turns[i][j] === turns[i+3][j+3] && turns[i][j] === turns[i+4][j+4]) {
                    wins.push(i + "_" + j);
                    wins.push((i+1) + "_" + (j+1));
                    wins.push((i+2) + "_" + (j+2));
                    wins.push((i+3) + "_" + (j+3));
                    wins.push((i+4) + "_" + (j+4));
                    break findWinLoop;
                }
                if (turns[i][j] === "X" && turns[i][j] === turns[i+1][j-1] && turns[i][j] === turns[i+2][j-2] && turns[i][j] === turns[i+3][j-3] && turns[i][j] === turns[i+4][j-4]) {
                    wins.push(i + "_" + j);
                    wins.push((i+1) + "_" + (j-1));
                    wins.push((i+2) + "_" + (j-2));
                    wins.push((i+3) + "_" + (j-3));
                    wins.push((i+4) + "_" + (j-4));
                    break findWinLoop;
                }
            }
            if(winner === "O") {
                if (turns[i][j] === "O" && turns[i][j] === turns[i][j+1] && turns[i][j] === turns[i][j+2] && turns[i][j] === turns[i][j+3] && turns[i][j] === turns[i][j+4]) {
                    wins.push(i + "_" + j);
                    wins.push(i + "_" + (j+1));
                    wins.push(i + "_" + (j+2));
                    wins.push(i + "_" + (j+3));
                    wins.push(i + "_" + (j+4));
                    break findWinLoop;
                }
                if (turns[i][j] === "O" && turns[i][j] === turns[i+1][j] && turns[i][j] === turns[i+2][j] && turns[i][j] === turns[i+3][j] && turns[i][j] === turns[i+4][j]) {
                    wins.push(i + "_" + j);
                    wins.push((i+1) + "_" + j);
                    wins.push((i+2) + "_" + j);
                    wins.push((i+3) + "_" + j);
                    wins.push((i+4) + "_" + j);
                    break findWinLoop;
                }
                if (turns[i][j] === "O" && turns[i][j] === turns[i+1][j+1] && turns[i][j] === turns[i+2][j+2] && turns[i][j] === turns[i+3][j+3] && turns[i][j] === turns[i+4][j+4]) {
                    wins.push(i + "_" + j);
                    wins.push((i+1) + "_" + (j+1));
                    wins.push((i+2) + "_" + (j+2));
                    wins.push((i+3) + "_" + (j+3));
                    wins.push((i+4) + "_" + (j+4));
                    break findWinLoop;
                }
                if (turns[i][j] === "O" && turns[i][j] === turns[i+1][j-1] && turns[i][j] === turns[i+2][j-2] && turns[i][j] === turns[i+3][j-3] && turns[i][j] === turns[i+4][j-4]) {
                    wins.push(i + "_" + j);
                    wins.push((i+1) + "_" + (j-1));
                    wins.push((i+2) + "_" + (j-2));
                    wins.push((i+3) + "_" + (j-3));
                    wins.push((i+4) + "_" + (j-4));
                    break findWinLoop;
                }
            }

        }
    }
    wins.forEach(win => {
        document.getElementById(win).classList.add("strong");
    })
}

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
        element.classList.remove("x");
        element.classList.remove("o");
        element.classList.remove("strong");
    });
}

