sendGet("/tasks", (success, result) => {
    if(!success || result["error"] != null) {
        return;
    }

    var tasks = result["tasks"];
    var importantTaskDiv = document.getElementById("important-tasks");
    var todayTaskDiv = document.getElementById("today-tasks");
    var boardsDiv = document.getElementById("boards");

    var todayDate = new Date();

    for(var i = 0; i < tasks.length; i++) {
        var task = tasks[i];   

        var taskDate = new Date(task["deadline"])
        if(taskDate.getDate() == todayDate.getDate() && taskDate.getMonth() == todayDate.getMonth() && taskDate.getFullYear() == todayDate.getFullYear()) {
            addTask(todayTaskDiv, task);
            continue;
        }

        if(task["priority"] > 1) {
            addTask(importantTaskDiv, task);
        }
    }

});


function addTask(parentDiv, task) {
    var taskElt = document.createElement("p");
    taskElt.setAttribute("class", "task-elt");
    
    var hr = document.createElement("hr");
    taskElt.innerText = task["title"];

    parentDiv.appendChild(taskElt);
    parentDiv.appendChild(hr);
}
