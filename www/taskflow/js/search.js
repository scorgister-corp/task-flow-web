document.getElementById("search-btn").onclick = search;

function search() {
    var val = document.getElementById("search-bar").value;

    window.location = "search.html?q=" + val;
}