/// Calls the given function once the DOM is ready.
function ready(f) {
    document.addEventListener("DOMContentLoaded", f);
}
/// Counts the number of non-whitespace characters. 
function countCharacters(s) {
    if (!s) {
        return 0;
    }
    return s.replace(/\s+/g, '').length;
}
/// Persists the specified input field or text area to local storage.
function storeLocally(id) {
    var el = document.getElementById(id);
    var handle;
    if (el) {
        el.value = localStorage.getItem(id);
        el.addEventListener("input", function (e) {
            clearTimeout(handle);
            handle = setTimeout(function () {
                localStorage.setItem(id, el.value);
            }, 500);
        });
    }
}
ready(function () {
    // persist all user input
    ["title", "author", "genre", "text"].forEach(storeLocally);
    // setup character counting
    var text = document.getElementById("text");
    var count = document.getElementById("count");
    function updateCount() {
        count.textContent = String(countCharacters(text.value));
    }
    text.addEventListener("input", updateCount);
    updateCount();
});
//# sourceMappingURL=app.js.map