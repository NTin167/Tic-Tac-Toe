const url = 'http://localhost:8080';
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
            console.log(typeof data);
            displayResponse(data);
        })

//        if(playerType == "X") {
//                    setInterval(function(){
//                        stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
//                            let data = JSON.parse(response.body);
//                            console.log(data);
//                        })
//                    }, 3000);
//        }
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
                console.log(data);
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

function load_charts() {
    fetch(url + "/game/getAllPlayer")
        .then (response => response.json())
        .then (data => {
            let charts = data.sort((a, b) => {
                return b.score - a.score;
            })
            let listRate = $(".rating__list");
            let htmls = charts.map(function(chart) {
                let findInd = charts.findIndex(ele => ele == chart);
                if(findInd == 0){
                    return `
                        <li class="rating__item">
                                <span class="rating__item-ranking">
                                    ${findInd + 1}
                                    <i class="gold-medal ranking-medal fa-solid fa-medal"></i>
                                </span>
                            <img src="http://vn.blog.kkday.com/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" alt="Avt" class="rating__item-avatar">
                            <span class="rating__item-user-name">${chart.login}</span>
                            <span class="rating__item-mark">
                                ${chart.score}
                                <span class="rating__item-mark-unit">đ</span>
                            </span>
                        </li>
                    `;
                }
                else if(findInd == 1){
                    return `
                        <li class="rating__item background-dif">
                                <span class="rating__item-ranking">
                                    ${findInd + 1}
                                    <i class="silver-medal ranking-medal fa-solid fa-medal"></i>
                                </span>
                            <img src="http://vn.blog.kkday.com/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" alt="Avt" class="rating__item-avatar">
                            <span class="rating__item-user-name">${chart.login}</span>
                            <span class="rating__item-mark">
                                ${chart.score}
                                <span class="rating__item-mark-unit">đ</span>
                            </span>
                        </li>
                    `;
                }
                else if(findInd == 2){
                    return `
                        <li class="rating__item">
                                <span class="rating__item-ranking">
                                    ${findInd + 1}
                                    <i class="bronze-medal ranking-medal fa-solid fa-medal"></i>
                                </span>
                            <img src="http://vn.blog.kkday.com/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" alt="Avt" class="rating__item-avatar">
                            <span class="rating__item-user-name">${chart.login}</span>
                            <span class="rating__item-mark">
                                ${chart.score}
                                <span class="rating__item-mark-unit">đ</span>
                            </span>
                        </li>
                    `;
                }
                else if(findInd %2 == 1){
                    return `
                        <li class="rating__item background-dif">
                                <span class="rating__item-ranking">
                                    ${findInd + 1}
                                </span>
                            <img src="http://vn.blog.kkday.com/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" alt="Avt" class="rating__item-avatar">
                            <span class="rating__item-user-name">${chart.login}</span>
                            <span class="rating__item-mark">
                                ${chart.score}
                                <span class="rating__item-mark-unit">đ</span>
                            </span>
                        </li>
                    `;
                }
                else {
                    return `
                        <li class="rating__item">
                                <span class="rating__item-ranking">
                                    ${findInd + 1}
                                </span>
                            <img src="http://vn.blog.kkday.com/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" alt="Avt" class="rating__item-avatar">
                            <span class="rating__item-user-name">${chart.login}</span>
                            <span class="rating__item-mark">
                                ${chart.score}
                                <span class="rating__item-mark-unit">đ</span>
                            </span>
                        </li>
                    `;
                }
            });
            listRate.innerHTML =htmls.join('');
        })
        .catch (error => console.log(error))
}
load_charts();

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
            closeModal();
            $(".game__select").classList.add("hide");
            $(".enter-id-room").classList.add("hide");
            $(".game__main").classList.remove("hide");
            $(".player").classList.remove("hide");
            if(playerType == "X"){
                $(".x-name").innerText = loginName;
            }
            $(".player-x-img").classList.add("rainbow");
            $(".player-o-img").classList.remove("rainbow");
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
            $(".player").classList.remove("hide");
            if(playerType == "O"){
                $(".x-name").innerText = data.player1.login;
                $(".o-name").innerText = loginName;
            }
            $(".player-x-img").classList.add("rainbow");
            $(".player-o-img").classList.remove("rainbow");
        })
        .catch(error => {
            console.log(error);
            create_game(loginName);
        });
    }
}


function connectToSpecificGame(loginName, gameId) {
    fetch(url + "/game/connect", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
             "player": {
                 "login": loginName
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
            closeModal();
            $(".enter-id-room").classList.add("hide");
            $(".game__select").classList.add("hide");
            $(".game__main").classList.remove("hide");
             $(".player").classList.remove("hide");
            if(playerType == "O"){
                $(".x-name").innerText = data.player1.login;
                $(".o-name").innerText = loginName;
            }
            $(".player-x-img").classList.add("rainbow");
            $(".player-o-img").classList.remove("rainbow");
        })
        .catch(error => {
            console.log(error);
            alert("Nhập sai id phòng!");
        })

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
