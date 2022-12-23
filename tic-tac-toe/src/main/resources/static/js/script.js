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
var cur_chess = [0, 0];
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

$(".btn-login").onclick = function() {
    openModal();
    $(".login-form").classList.remove("hide");
}

$(".btn-register").onclick = function() {
    openModal();
    $(".register-form").classList.remove("hide");
}

$(".submit-login").onclick = function() {
    let username = $(".username-login").value;
    let password = $(".password-login").value;
    login(username, password);
}

$(".submit-register").onclick = function() {
    let name = $(".name-register").value;
    let username = $(".username-register").value;
    let email = $(".email-register").value;
    let password = $(".password-register").value;
    let confirmpassword = $(".confirm-password").value;
    register(name, username, email, password, confirmpassword);
}

$(".btn-register-inlg").onclick = function() {
    $(".login-form").classList.add("hide");
    $(".register-form").classList.remove("hide");
}

$(".btn-login-inrgt").onclick = function() {
    $(".register-form").classList.add("hide");
    $(".login-form").classList.remove("hide");
}

$(".btn-play-ai").onclick = function() {
    if($(".user-ele").classList.contains("hide")){
        alert("Vui lòng đăng nhập!");
    }else{
        $(".game__select").classList.add("hide");
        var loginName = $(".user-name").innerText;
        $(".x-name").innerText = loginName;
        $(".player").classList.remove("hide");
        $(".game__main").classList.remove("hide");
        create_gameAi(loginName);
    }
}

$(".btn-play-random").onclick = function() {
    if($(".user-ele").classList.contains("hide")){
//        openModal();
//        $(".enter-name-form").classList.remove("hide");
        alert("Vui lòng đăng nhập!");
    }else {
        $(".game__select").classList.add("hide");
        var loginName = $(".user-name").innerText;
        $(".game__main").classList.remove("hide");
        connectToRandom(loginName);
    }
}

$(".btn-playing").onclick = function() {
    if(gameAi) {
        reset();
        closeModal();
        $(".mark-form").classList.add("hide")
        $(".game__main").classList.remove("hide");
        var loginName = $(".user-name").innerText;
        create_gameAi(loginName);
    }
    else {
        reset();
        closeModal();
        $(".mark-form").classList.add("hide")
        $(".game__main").classList.remove("hide");
        var loginName = $(".user-name").innerText;
        connectToRandom(loginName);
    }
}

$(".btn-exit").onclick = function() {
    reset();
    closeModal();
    $(".mark-form").classList.add("hide")
    $(".game__main").classList.add("hide");
    $(".player").classList.add("hide");
    $(".game__select").classList.remove("hide");
    if(gameAi){
        gameAi = false;
    }
}

$(".modal__overlay").onclick = function(){
    if($(".mark-form").classList.contains("hide")){
      reset();
      closeModal();
      $(".mark-form").classList.add("hide");
      $(".game__main").classList.add("hide");
      $(".game__select").classList.remove("hide");
    }
}

function playerTurn(turn, id) {
    if (gameOn) {
        var spotTaken = document.getElementById(id).innerText;
        if (spotTaken === "") {
//        tic.forEach(element => {
//            element.onclick = function () {
//                console.log("no click");
//            }
//        });
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                document.getElementById(i + "_" + j).classList.remove("strong");
            }
        }
        console.log("gameAi: " + gameAi)
            if(gameAi){
                tic.forEach(element => {
                    element.onclick = function () {
                        console.log("no click");
                    }
                });
                document.getElementById(id).innerText = "X";
                makeAMoveAi(playerType, id.split("_")[0], id.split("_")[1]);
            }
            else {
                if(playerType == "X") {
                    console.log("toi luot X");
                    tic.forEach(element => {
                        element.onclick = function () {
                            console.log("no click");
                        }
                    });
                    makeAMove(playerType, id.split("_")[0], id.split("_")[1]);
                }
                if(playerType == "O") {
                    console.log("toi luot O");
                    tic.forEach(element => {
                        element.onclick = function () {
                            console.log("no click");
                        }
                    });
                    makeAMove(playerType, id.split("_")[0], id.split("_")[1]);
                }
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
                document.getElementById(i + "_" + j).classList.add("x");
                document.getElementById(i + "_" + j).classList.add("no-hover");
                document.getElementById(i + "_" + j).innerText = 'X';
            } else if (board[i][j] === 2) {
                turns[i][j] = 'O';
                document.getElementById(i + "_" + j).classList.add("o");
                document.getElementById(i + "_" + j).classList.add("no-hover");
                document.getElementById(i + "_" + j).innerText = 'O';
            }
            let id = i + "_" + j;
            document.getElementById(id).innerText = turns[i][j];
        }
    }
    if (data.winner != null) {
//        alert("Winner is " + data.winner);
//        reset();
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                let id = i + "_" + j;
                document.getElementById(i + "_" + j).classList.remove("no-hover");
                document.getElementById(id).innerText = turns[i][j];
            }
        }
        let wins = [];
        let winner = data.winner;
        findWin(turns, wins, winner);
        setTimeout(() =>{
            openModal();
            $(".mark-form").classList.remove("hide");
            if(playerType == "X" && winner === "X") {
                $(".label-win").classList.remove("hide");
                $(".label-lose").classList.add("hide");
            }
            if(playerType == "O" && winner === "X") {
                $(".label-win").classList.add("hide");
                $(".label-lose").classList.remove("hide");
            }
            if(playerType == "X" && winner === "O") {
                $(".label-win").classList.add("hide");
                $(".label-lose").classList.remove("hide");
            }
            if(playerType == "O" && winner === "O") {
                $(".label-win").classList.remove("hide");
                $(".label-lose").classList.add("hide");
            }
        }, 1000)
    }
    gameOn = true;
    console.log(playerType);
    cur_chess[0] = 0;
    cur_chess[1] = 0;
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if(board[i][j] == 1){
                cur_chess[0]++;
            }
            if(board[i][j] == 2){
                cur_chess[1]++;
            }
        }
    }
    console.log(cur_chess);
    if(playerType == "X" && (cur_chess[0] == cur_chess[1])) {
        console.log("X danh");
        tic.forEach(element => {
            element.onclick = function () {
                var slot = this.getAttribute("id");
                playerTurn(turn, slot);
            }
        });
    }
    if(playerType == "O" && (cur_chess[0] != cur_chess[1])) {
        console.log("O danh");
        tic.forEach(element => {
            element.onclick = function () {
                var slot = this.getAttribute("id");
                playerTurn(turn, slot);
            }
        });
    }
}

function displayResponseAi(data) {
    let board = data.board.square;
    let winner = data.winner;
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            ts[i][j] = turns[i][j];
        }
    }
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
                let z = document.getElementById(idtemp);
                z.classList.add("strong");
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

