sendGet("/tasks", (success, result) => {
    if(!success || result["error"] != null) {
        return;
    }

    var tasks = result["tasks"];
    var importantTaskDiv = document.getElementById("important-tasks");
    var todayTaskDiv = document.getElementById("today-tasks");
    var boardsDiv = document.getElementById("boards");

    var todayDate = new Date().toISOString();
    todayDate = todayDate.substring(0, todayDate.indexOf("T"));
    
    for(var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        
        if(task["priority"] > 1) {
            addTask(importantTaskDiv, task);
        }
        
        console.log(task["deadline"] + "  " + todayDate);
        if(task["deadline"] != null && task["deadline"].startsWith(todayDate)) {
            console.log(task);
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
