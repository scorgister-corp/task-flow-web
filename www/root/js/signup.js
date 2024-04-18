document.getElementById("send-form").onclick = sendForm;

if(getCookie("token") != null) {
    window.location = "/";
}


function sendForm() {
    var username = document.getElementById("username-field").value;
    var email = document.getElementById("email-field").value;
    var password = document.getElementById("password-field").value;
    var confirmPassword = document.getElementById("confirm-password-field").value;

    if(username != undefined && username != "" && email != undefined && email != "" && password != undefined && password != "" && confirmPassword != undefined && confirmPassword != "" && password === confirmPassword) {
        sendPost("/register", null, {username: username, password: password, email:email}, (success, result) => {
            if(!success)
                return;

            if(result["result"] == 0) {
                window.location = "/";
                return;
            }
        });
    }

}