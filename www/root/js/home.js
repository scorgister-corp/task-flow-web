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
