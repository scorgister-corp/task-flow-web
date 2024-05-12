//temp
for(var elt in document.getElementsByClassName("task-minim")) {
    document.getElementsByClassName("task-minim")[elt].onclick = showTask;
}


function showTask(e) {
    document.getElementById("full-container").style = "display: block;";
    document.getElementById("veil").style = "display: block;";
}

function restore() {
    document.getElementById("veil").style = "display: none;";
    document.getElementById("full-container").style = "display: none;";
}