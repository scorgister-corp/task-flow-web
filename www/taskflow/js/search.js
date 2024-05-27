document.getElementById("search-btn").onclick = search;
document.getElementById("search-bar").addEventListener("keypress", (e) => {
    if(e.key == "Enter")
        search();
});

function search() {
    var val = document.getElementById("search-bar").value;

    window.location = "search.html?q=" + val;
}

function load() {
    var params = new URLSearchParams(document.location.search);
    var query = params.get("q");

    if(query == undefined || query == "") {
        return;
    }

    var val = document.getElementById("search-bar").value = query;

}

load();