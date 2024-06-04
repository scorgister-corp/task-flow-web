const WORDS_LIST = ["Task management software", "Efficiency", "Organization", "Productivity", "Prioritization", "Collaboration", "Scheduling", "Reminder", "Workflow", "Automation", "Integration", "Accessibility", "Tracking", "Flexibility", "Customization", "Notifications", "Task Assignment"];

let banner = document.getElementById('banner');

var words = "       "
for(var i in WORDS_LIST)
words += WORDS_LIST[i] + "       ";

var word = document.createElement("pre");
word.innerText = words;
word.className = "banner-text";
banner.append(word);

let textSize = banner.scrollWidth;

function defile(){
    let pos = word.style.marginLeft.replace('px','');
    pos -= 2;
    if(pos < -textSize){
        pos = window.outerWidth;
    }
    word.style.marginLeft = pos+"px";


    setTimeout(defile, 50);
}

defile();

if(getCookie("token") != undefined) {
    var logBtn = document.getElementById("login-btn");

    logBtn.innerText = "Access TaskFlow";
    logBtn.href = "/taskflow/";
}


document.getElementById("form-send").onclick = formSend;

function formSend() {
    var name = document.getElementById("contact-name").value;
    var email = document.getElementById("contact-email").value;
    var msg = document.getElementById("contact-msg").value;

    if(name == "" || name == undefined) {
        alert("The name is empty");
        return;
    }
    if(email == "" || email == undefined) {
        alert("The email is empty");
        return;
    }
    if(msg == "" || msg == undefined) {
        alert("The message is empty");
        return;
    }

    if(validateEmail(email) == null) {
        alert("Invalid email address");
        return;
    }

    sendPost("/report", {name: name, email: email, msg: msg}, (success, result) => {
        console.log(result);
        if(!success || result["error"] != undefined) {
            alert("An error occurred");
            return;
        }
        
        alert("Your message has been successfully saved");
        document.getElementById("contact-name").value = "";
        document.getElementById("contact-email").value = "";
        document.getElementById("contact-msg").value = "";
    });
}
