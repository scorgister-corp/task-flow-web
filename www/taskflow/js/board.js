
function showTask(e) {
    document.getElementById("full-container").style = "display: block;";
    document.getElementById("veil").style = "display: block;";

    document.getElementById("full-delete").value = e.target.id;

    sendPost("/task", {id: e.target.id}, (success, result) => {
        document.getElementById("full-title").innerText = result["title"];

        if(result["deadline"]) {
            var taskDate = new Date(result["deadline"])
            document.getElementById("full-deadline").innerText = taskDate.toLocaleDateString();
        }else {
            document.getElementById("full-deadline").hidden = true;
            document.getElementById("full-deadline-title").hidden = true;
        }

        if(result["description"] != undefined && result["description"] != "") {
            document.getElementById("full-description").innerText = result["description"];
        }else {
            document.getElementById("full-description").hidden = true;
            document.getElementById("full-description-title").hidden = true;
        }

        document.getElementById("full-completed").checked = result["completed"];
        document.getElementById("full-completed").value = e.target.id;

        document.getElementById("full-completed").onclick = check;
    });
}

function restore() {
    document.getElementById("veil").style = "display: none;";
    document.getElementById("full-container").style = "display: none; ";

    document.getElementById("full-title").innerText = "Loading..."
    document.getElementById("full-deadline").innerText = "loading..."
    document.getElementById("full-description").innerText = "loading..."
    document.getElementById("full-completed").checked = false;

    document.getElementById("full-deadline").hidden = false;
    document.getElementById("full-deadline-title").hidden = false;
    document.getElementById("full-description").hidden = false;
    document.getElementById("full-description-title").hidden = false;

    document.getElementById("full-completed").checked = false;
    document.getElementById("full-completed").value = -1;
}

function check(e) {
    var taskid = document.getElementById("full-completed").value;
    var completed = e.target.checked;
    if(completed == true)
        completed = "1";
    else
        completed = "0";

    sendPost("/task/update/state", {id: taskid, completed: completed}, (success, result) => {
        if(!success || result["error"] != undefined)
            return;
        if(completed == true)
            document.getElementById(taskid).setAttribute("class", "task-minim grad-dark-btn completed");
        else
            document.getElementById(taskid).setAttribute("class", "task-minim grad-dark-btn");

        restore();

    });
}

function load() {
    var params = new URLSearchParams(document.location.search);
    var boardToken = params.get("token");
    if(boardToken == undefined || boardToken == "")
        window.location = "index.html";

    var shareBtn =  document.getElementById("share-btn");
    shareBtn.value = boardToken;
    shareBtn.onclick = share;

    document.getElementById("leave-btn").value = boardToken;

    var delBtn =  document.getElementById("full-delete");
    delBtn.onclick = del;

    document.getElementById("add-task-shortcut").onclick = addShortcut;

    sendPost("/board", {token: boardToken}, (success, result) => {
        if(!success || result["code"] != undefined) {
            alert("Unknown board: return to home page !");
            window.location = "index.html";
            return;
        }

        document.getElementById("board-title").innerText = result["name"];

        if(result["members"].length != 0) {
           var membersContainer = document.getElementById("members");

            for(var i = 0; i < result["members"].length - 1; i++) {
                var spn = document.createElement("span");
                spn.innerText = result["members"][i] + ", ";

                membersContainer.appendChild(spn);
            }
            
                
            var spn = document.createElement("span");
            spn.innerText = result["members"][result["members"].length - 1];
            membersContainer.appendChild(spn);

            var leaveBtn = document.getElementById("leave-btn");
            document.getElementById("share-btn").style = "right: 10%; position: relative;";
            leaveBtn.style = "left: 10%; position: relative;";

            if(result["members"].length == 1)
                leaveBtn.innerText = "delete";

            leaveBtn.onclick = leave;
            leaveBtn.hidden = false;
            shareBtn.hidden = false;
            document.getElementById("members-title").hidden = false;

        }else {
            document.getElementById("members-title").hidden = true;
            document.getElementById("leave-btn").hidden = true;
            document.getElementById("share-btn").hidden = true;
        }

    });

    sendPost("/boardtasks", {token: boardToken}, (success, result) => {
        if(!success || result["code"] != undefined)
            return;

        for(var i = 0; i < result.length; i++) {
            var task = result[i];

            if(task["priority"] <= 0)
                addTask("low", task);
            else if (task["priority"] == 1)
                addTask("medium", task);
            else
                addTask("high", task);
        }
        if(window.location.hash != "")
            window.location = window.location;
    });
}

function leave(e) {
    if(confirm("Are you sure you want to delete the board " + document.getElementById("board-title").innerText + " ?") == true)
        sendPost("/board/leave", {token: e.target.value}, (success, result) => {
            if(!success || result["code"] != true) {
                alert(result["message"]);
                return;
            }

            window.location = "index.html";
        });
}

function share(e) {
    navigator.clipboard.writeText(window.location.origin + "/taskflow/join?token=" + e.target.value);
    alert("Share link copied to clipboard");
}

function del(e) {
    if(confirm("Are you sure you want to delete the task " + document.getElementById("full-title").innerText + " ?") == true) {
        sendPost("/task/delete", {id: e.target.value}, (success, result) => {
            document.getElementById(e.target.value).parentElement.removeChild(document.getElementById(e.target.value));

            restore();
        });
    }
}

function addShortcut(e) {
    window.location = "add.html?token=" + document.getElementById("share-btn").value;
}

function addTask(eltId, task) {
    var elt = document.getElementById(eltId);

    if(elt == undefined)
        return;

    var but = document.createElement("button");
    if(task["completed"])
        but.setAttribute("class", "task-minim grad-dark-btn completed");
    else
        but.setAttribute("class", "task-minim grad-dark-btn");
    but.setAttribute("id", task["id"]);

    but.innerText = task["title"];
    but.onclick = showTask;

    elt.appendChild(but);
}

load();