function update() {
    var title = document.getElementById("title-field").value.trim();
    var description = document.getElementById("description-field").value.trim();
    var deadline = document.getElementById("deadline-field").value.trim();
    var priority = document.getElementById("priority-field").value.trim();

    var params = new URLSearchParams(document.location.search);
    var id = params.get("id");

    if(id == undefined || id == "") {
        window.location = "index.html";
        return;
    }

    sendPost("/task/update", {id:id, title: title, description: description, priority: priority, deadline: deadline}, (success, result) => {
        if(!success || result["code"] != true) {
            showError(result["message"]);
            return;
        }

        var params = new URLSearchParams(document.location.search);
        var boardToken = params.get("token");

        if(boardToken != undefined && boardToken != "")
            window.location = "board.html?token=" + boardToken;
        else
            window.location = "index.html#boards"
    });
}

function load() {
    var params = new URLSearchParams(document.location.search);
    var id = params.get("id");

    if(id == undefined || id == "") {
        window.location = "index.html";
        return;
    }

    sendPost("/task", {id: id}, (success, result) => {
        if(!success || result["title"] == undefined || result["title"] == "") {
            window.location = "index.html";
            return;
        }
        
        document.getElementById("title-field").value = result["title"];
        document.getElementById("description-field").value = result["description"];

        if(result["deadline"] != undefined)
            document.getElementById("deadline-field").valueAsDate = new Date(result["deadline"]);

        document.getElementById("priority-field").value = result["priority"];
    });
}

function showError(error) {
    document.getElementById("form-status").innerText = error;
}

document.getElementById("send-form").onclick = update;
load();