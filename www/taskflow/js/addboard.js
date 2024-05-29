function add() {
    var title = document.getElementById("title-field").value.trim();


    sendPost("/addboard", {title: title}, (success, result) => {
        if(!success || result["code"] != true) {
            document.getElementById("form-status").innerText = result["message"];
            return;
        }

        window.location = "board.html?token=" + result["token"];
    });
}

document.getElementById("send-form").onclick = add;
