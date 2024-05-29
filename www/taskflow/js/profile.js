function load() {
    sendGet("/profile/infos", (success, result) => {
        if(!success || result["error"] != undefined) {
            return;
        }
        
        document.getElementById("username-field").value = result["username"];
        document.getElementById("email-field").value = result["email"];

    });
}

function update() {
    var username = document.getElementById("username-field").value.trim();
    var email = document.getElementById("email-field").value.trim();
    var cPassword = document.getElementById("current-password-field").value;
    var nPassword = document.getElementById("new-password-field").value;

    sendPost("/profile/update", {username: username, email: email, currentPassword: cPassword, newPassword: nPassword}, (success, result) => {
        if(!success || result["error"] != undefined) {
            document.getElementById("form-status").innerText = result["message"];
            return;
        }

        if(result["code"] != true) {
            document.getElementById("form-status").innerText = result["message"];
            return;
        } 

        window.location = "index.html";
    });
}

document.getElementById("send-form").onclick = update;

load();
