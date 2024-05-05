document.getElementById("send-form").onclick = sendForm;

if(getCookie("token") != null) {
    window.location = "/taskflow/";
}


function sendForm() {
    var username = document.getElementById("username-field").value;
    var email = document.getElementById("email-field").value;
    var password = document.getElementById("password-field").value;
    var confirmPassword = document.getElementById("confirm-password-field").value;

    
    if(username != undefined && username != "" && email != undefined && email != "" && password != undefined && password != "" && confirmPassword != undefined && confirmPassword != "" && password === confirmPassword) {

        sendPost("/register", {username: username, password: password, email: email}, (success, result) => {
            if(!success || result["error"] != undefined) {
                document.getElementById("form-status").innerText = "An error occurred";
                return;
            }

            if(result["result"] != 0) {
                var res = result["result"];
                var txt = "";
                switch(res) {
                    case -1:
                        txt = "no username";        
                        break;
                    case -2:
                        txt = "no password";        
                        break;
                    case -3:
                        txt = "no email";        
                        break;
                    case -4:
                        txt = "used username";        
                        break;
                    case -5:
                        txt = "used email";        
                        break;
                    case -6:
                        txt = "mail error";        
                        break;

                    default:
                        txt = "An error occurred";
                        break;
                }

                document.getElementById("form-status").innerText = txt;
                return;
            }
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
        });
    }

}