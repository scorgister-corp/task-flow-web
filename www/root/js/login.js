document.getElementById("send-form").onclick = sendForm;

if(getCookie("token") != null) {
    window.location = "/";
}

function sendForm() {
    var username = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;

    if(username != undefined && username != "" && password != undefined && password != "") {
        sendPost("/login", {username: username, password: password}, (success, result) => {
            if(!success) {
                return;
            }

            if(result["connection"]) {
                setCookie("token", result["token"], 15);
                window.location = "/";
                return;
            }
        });
    }

}