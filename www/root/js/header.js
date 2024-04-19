window.addEventListener("click", (e) => {
    if(!isMenu(e.target) && e.target != document.getElementById("menu-toggle-btn")) {
        document.getElementById("menu-toggle-btn").checked = false;
    }
});

function isMenu(target) {
    do {
        if(target.id == "menu")
            return true;

        target = target.parentNode;
    }while(target != undefined);
    return false;
}