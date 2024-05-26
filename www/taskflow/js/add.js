
function add() {
    var title = document.getElementById("title-field").value;
    var description = document.getElementById("description-field").value;
    var deadline = document.getElementById("deadline-field").value;
    var priority = document.getElementById("priority-field").value;
    var destination = document.getElementById("destination-field").value;

    sendPost("/add", {title: title, description: description, priority: priority, deadline: deadline, boardToken: destination}, (success, result) => {
        if(!success || result["error"]) {
            showError(result["message"]);
            return;
        }

        window.location = "board.html=?token=" + destination;
    });
}

function loadBoard() {
    sendGet("/boards", (success, result) => {
        if(!success || result["error"])
            return;
        
        var destination = document.getElementById("destination-field");
        for(i in result) {
            var elt = result[i];
            var op = document.createElement("option");

            op.innerText = elt["name"];
            op.value = elt["token"];
            destination.appendChild(op);
        }

    });
}

function showError(error) {
    document.getElementById("form-status").innerText = error;
}

document.getElementById("send-form").onclick = add;
loadBoard();