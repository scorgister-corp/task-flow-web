function add() {
    var title = document.getElementById("title-field").value;


    sendPost("/addboard", {title: title}, (success, result) => {
        if(!success || result["code"] != undefined) {
            document.getElementById("form-status").innerText = result["message"];
            return;
        }

        if(result["code"] != true) {
            document.getElementById("form-status").innerText = result["message"];
            return;
        } 

        window.location = "board.html?token=" + result["token"];
    });
}

document.getElementById("send-form").onclick = add;
