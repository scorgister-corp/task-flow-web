window.addEventListener("click", (e) => {
    console.log(document.getElementById("menu-toggle-btn").checked);

    if(!isMenu(e.target) && e.target != document.getElementById("menu-toggle-btn")) {
        document.getElementById("menu-toggle-btn").checked = false;
    }
});
document.getElementById("header-icon-toggle").onclick = (e) => {
    document.getElementById("menu-toggle-btn").checked = !document.getElementById("menu-toggle-btn").checked;
}

function isMenu(target) {
    do {
        if(target.id == "menu")
            return true;
        if(target.id == "header-icon-toggle")
            return true;

        target = target.parentNode;
    }while(target != undefined);
    return false;
}