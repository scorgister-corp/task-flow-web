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

function load() {
    var params = new URLSearchParams(document.location.search);
    var boardToken = params.get("token");
    if(boardToken == undefined || boardToken == "")
        window.location = "index.html";

    sendPost("/board", {token: boardToken}, (success, result) => {
        if(!success || result["error"] != undefined)
            return;

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

        }

        console.log(result);
    });

    sendPost("/boardtasks", {token: boardToken}, (success, result) => {
        if(!success || result["error"] != undefined)
            return;

        console.log(result);
    });
    }

load();