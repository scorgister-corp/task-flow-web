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

const publicKey = 'BMb5oIksbhqRSi0QaHl5vdbpUN6olSpVDcVVB-BHNSeQBIjmh9XhGAG7x1j9hE5-rCQPAgGpAlAzJISM_QpsZ7k';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/js/sw.js').then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swReg.pushManager.getSubscription().then(function(subscription) {
      if (subscription === null) {
        subscribeUser(swReg);
      }
    });
  }).catch(function(error) {
    console.error('Service Worker Error', error);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser(swRegistration) {
    const applicationServerKey = urlBase64ToUint8Array(publicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    }).then(function(subscription) {
        console.log('User is subscribed:', subscription);
        sendPost("/notif/subscribe", subscription, (success, result) => {});
    }).catch(function(err) {
        console.log('Failed to subscribe the user: ', err);
    });
}
