function load() {
    var params = new URLSearchParams(document.location.search);
    var query = params.get("q");

    if(query == undefined || query == "") {
        window.location = "index.html";
        return;
    }

    var tasksDiv = document.getElementById("tasks");
    var boardsDiv = document.getElementById("boards");

    sendPost("/search", {query: query}, (success, result) => {
        if(!success || result["code"] != true) {
            window.location = "index.html";
            return;
        }
        var taskCount = 0;
        var tasks = result["tasks"];
        for(var i = 0; i < tasks.length; i++)
            if(tasks[i]["completed"] == 0) {
                addTask(tasksDiv, tasks[i]);
                taskCount++;
            }

        if(taskCount == 0)
            addTaskNotFound(tasksDiv);

        var boards = result["boards"];
        for(var i = 0; i < boards.length; i++)
            addBoard(boardsDiv, boards[i]);

        if(boards.length == 0)
            addBoardNotFound(boardsDiv);
    });
}

function addTaskNotFound(parentDiv) {
    var taskElt = document.createElement("p");
    taskElt.setAttribute("class", "task-elt");
    
    var hr = document.createElement("hr");
    taskElt.innerText = "No result";

    parentDiv.appendChild(taskElt);
    parentDiv.appendChild(hr);
}

function addTask(parentDiv, task) {
    var taskElt = document.createElement("p");
    taskElt.setAttribute("class", "task-elt");
    
    var hr = document.createElement("hr");
    taskElt.innerText = task["title"];

    var btn = document.createElement("button");
    btn.setAttribute("class", "grad-btn");
    btn.value = task["board_token"] + "#" + task["id"];
    btn.innerText = "Show";
    btn.onclick = showBoard;

    taskElt.appendChild(btn);

    parentDiv.appendChild(taskElt);
    parentDiv.appendChild(hr);
}

function addBoard(parentDiv, board) {
    var taskElt = document.createElement("p");
    taskElt.setAttribute("class", "task-elt");
    
    var hr = document.createElement("hr");
    taskElt.innerText = board["name"];

    var btn = document.createElement("button");
    btn.setAttribute("class", "grad-btn");
    btn.value = board["token"];
    btn.innerText = "Show";
    btn.onclick = showBoard;

    taskElt.appendChild(btn);

    parentDiv.appendChild(taskElt);
    parentDiv.appendChild(hr);
}

function addBoardNotFound(parentDiv) {
    var taskElt = document.createElement("p");
    taskElt.setAttribute("class", "task-elt");
    
    var hr = document.createElement("hr");
    taskElt.innerText = "No result";

    parentDiv.appendChild(taskElt);
    parentDiv.appendChild(hr);
}


function showBoard(e) {
    window.location = "board.html?token=" + e.target.value;
}

load();