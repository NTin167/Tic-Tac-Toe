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

function register(name, username, email, password, confirmpassword) {
    let check = true;
    let checkmail = false;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
        checkmail = false;
    }
    else{
        checkmail = true;
    }
    if(name == "" || name.replaceAll(" ","") == ""){
        alert("Vui lòng nhập Tên của bạn!");
        check = false;
    }else if(username == "" || username.replaceAll(" ","") == ""){
        alert("Vui lòng nhập Tên tài khoản!");
        check = false;
    }else if(email == "" || email.replaceAll(" ","") == ""){
        alert("Vui lòng nhập Email!");
        check = false;
    }else if(password == "" || password.replaceAll(" ","") == ""){
        alert("Vui lòng nhập Mật khẩu!");
        check = false;
    }else if(confirmpassword == "" || confirmpassword.replaceAll(" ","") == ""){
        alert("Vui lòng Xác nhận mật khẩu!");
        check = false;
    }else if(confirmpassword == "" || confirmpassword.replaceAll(" ","") == ""){
        alert("Vui lòng Xác nhận mật khẩu!");
        check = false;
    }else if(!checkmail){
        alert("Email không hợp lệ!");
        check = false;
    }else if(password.length < 6){
        alert("Mật khẩu phải dài hơn 6 ký tự!");
        check = false;
    }else if(password != confirmpassword){
        alert("Xác nhận mật khẩu chưa đúng!");
        check = false;
    }

    if(check) {
        fetch(url + "/caro/auth/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name,
                "username": username,
                "email": email,
                "password": password
            })
        })
        .then (response => response.json())
        .then (data => {
            if(data.success == true){
                alert("Đăng ký thành công!");
                $(".register-form").classList.add("hide");
                $(".login-form").classList.remove("hide");
            }
            else {
                alert("Có lỗi xảy ra. Vui lòng thử lại!");
            }
        })
        .catch(error => {
            console.log(error);
            alert("Vui lòng điền đầy đủ thông tin!");
        })
    }


}

function login(username, password) {
    if(username == "" || username.replaceAll(" ","") == "" || password == "" || password.replaceAll(" ","") == ""){
        alert("Vui lòng nhập đầy đủ Tên tài khoản và Mật khẩu!");
    }
    else{
        fetch(url + "/caro/auth/signin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "usernameOrEmail": username,
                "password": password
            })
        })
        .then (response => response.json())
        .then (data => {
            if(data.success == true) {
                alert("Đăng nhập thành công!");
                closeModal();
                $(".login-form").classList.add("hide");
                $(".login").classList.add("hide");
                $(".register").classList.add("hide");
                $(".user-ele").classList.remove("hide");
                $(".user-name").innerText = username;
            }
            else{
                alert("Có lỗi xảy ra. Xin vui lòng thử lại!")
            }
        })
        .catch(error => {
            console.log(error);
            alert("Sai thông tin đăng nhập!");
        })
    }

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
//               $(".wap-loading").classList.remove("hide");
//               console.log("loading");


//            $(".game__select").classList.add("hide");
//            let inte = setInterval(function() {
//                if(data.status == "NEW") {
//                    $(".wap-loading").classList.remove("hide");
//                    console.log('hi');
//                }
//                else {
//                    $(".wap-loading").classList.add("hide");
//                    console.log('hihi');
//                    clearInterval(inte);
//                }
//            }, 1000)
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
        .catch(error => {
            console.log(error);
            create_game(loginName);
        });
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
        var loginName = $("#name-play").value;
        if(loginName == ""){
            alert("Vui lòng nhập tên!");
        }
        else {
            loginName = loginName.replaceAll(" ","");
            if(loginName == ""){
                alert("Vui lòng nhập tên!");
            }
            else {
                closeModal();
                $(".enter-name-form").classList.add("hide");
                $(".register").classList.add("hide");
                $(".login").classList.add("hide");
                $(".user-ele").classList.remove("hide");
                $(".user-name").innerText = loginName;
//                $(".game__select").classList.add("hide");
//                $(".player").classList.remove("hide");
//                $(".game__main").classList.remove("hide");
//                create_gameAi(loginName);
            }
        }
    }
}

$(".btn-enter-name").onclick = function(event) {
    var loginName = $("#name-play").value;
    if(loginName == ""){
        alert("Vui lòng nhập tên!");
    }
    else {
        loginName = loginName.replaceAll(" ","");
        if(loginName == ""){
            alert("Vui lòng nhập tên!");
        }
        else {
            closeModal();
            $(".login").classList.add("hide");
            $(".register").classList.add("hide");
            $(".user-ele").classList.remove("hide");
            $(".user-name").innerText = loginName;
            $(".enter-name-form").classList.add("hide");
        }
    }
}
