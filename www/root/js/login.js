document.getElementById("send-form").onclick = sendForm;
document.getElementById("username-field").addEventListener("keydown", inputEvent);
document.getElementById("password-field").addEventListener("keydown", inputEvent);

function inputEvent(event) {
    if(event.key == "Enter") {
        sendForm();
        return;
    }
}

if(getCookie("token") != null) {
    window.location = "/taskflow/";
}

function sendForm() {
    var username = document.getElementById("username-field").value.trim();
    var password = document.getElementById("password-field").value.trim();

    if(username != undefined && username != "" && password != undefined && password != "") {
        sendPost("/login", {username: username, password: password}, (success, result) => {
            if(!success || result["error"] != undefined) {
                document.getElementById("form-status").innerText = "An error occurred";
                return;
            }

            if(result["connection"]) {
                setCookie("token", result["token"], 15);
                var params = new URLSearchParams(document.location.search);
                var redirect = params.get("redirect");
                if(redirect != undefined && redirect != "")
                    window.location = redirect;
                else
                    window.location = "/taskflow/";

                return;
            }else {
                document.getElementById("form-status").innerText = result["message"];
            }
        });
    }

}