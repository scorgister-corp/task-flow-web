sendGet("/tasks", (success, result) => {
    if(!success || result["error"] != null) {
        return;
    }

    var tasks = result["tasks"];
    var importantTaskDiv = document.getElementById("important-tasks");
    var todayTaskDiv = document.getElementById("today-tasks");

    var todayDate = new Date();

    for(var i = 0; i < tasks.length; i++) {
        var task = tasks[i];

        if(task["completed"] == 1) {
            continue;
        }

        var taskDate = new Date(task["deadline"])
        if(taskDate.getDate() == todayDate.getDate() && taskDate.getMonth() == todayDate.getMonth() && taskDate.getFullYear() == todayDate.getFullYear()) {
            addTask(todayTaskDiv, task);
            continue;
        }

        if(task["priority"] > 1)
            addTask(importantTaskDiv, task);
    }

});

sendGet("/boards", (success, result) => {
    if(!success || result["error"] != null)
        return;

    var boardsDiv = document.getElementById("boards");

    for(var i = 0; i < result.length; i++)
        addBoard(boardsDiv, result[i]);

});

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

function showBoard(e) {
    window.location = "board.html?token=" + e.target.value;
}
