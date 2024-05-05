document.getElementById("send-form").onclick = sendForm;

if(getCookie("token") != null) {
    window.location = "/taskflow/";
}

function sendForm() {
    var username = document.getElementById("username-field").value;
    var password = document.getElementById("password-field").value;

    if(username != undefined && username != "" && password != undefined && password != "") {
        sendPost("/login", {username: username, password: password}, (success, result) => {
            if(!success || result["error"] != undefined) {
                document.getElementById("form-status").innerText = "An error occurred";
                return;
            }

            if(result["connection"]) {
                setCookie("token", result["token"], 15);
                window.location = "/taskflow/";
                return;
            }else {
                document.getElementById("form-status").innerText = result["message"];
            }
        });
    }

}