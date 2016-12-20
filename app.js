/** Defines the maximum number of characters */
var maxCharCount = 2222;
/** Calls the given function once the DOM is ready. */
function ready(f) {
    document.addEventListener("DOMContentLoaded", f);
}
/** Counts the number of non-whitespace, non-markup characters. */
function countCharacters(s) {
    if (!s) {
        return 0;
    }
    return s
        .replace(/^```\w*$/gm, "")
        .replace(/\_(.+?)\_/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/`(.+?)`/g, "$1")
        .replace(/\s+/g, '')
        .replace(/^---+$/gm, "").length;
}
/**
 * Persists the specified input field or text area to local storage.
 * @param id  ID of `input` or `textarea` element to persist its value after changes
 */
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
/**
 * Implements the preview function.
 * @param id          ID of parent element search for `data-text` and `data-html` annotation
 * @param properties  array of IDs of `input` or `textarea` element to listen for changes
 */
function setupPreview(id, properties) {
    var handle;
    function value(id) {
        return document.getElementById(id).value;
    }
    function format(s) {
        var pres = [];
        return "<p>" + s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/^```\w*$([\s\S]*)^```$/gm, function (_, m) { return "<pre>" + (pres.push(m) - 1) + "</pre>"; })
            .replace(/\_(.+?)\_/g, "<em>$1</em>")
            .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, "<code>$1</code>")
            .replace(/"\b/g, "„")
            .replace(/"/g, "“")
            .replace(/^---+$/gm, "\n<hr>\n")
            .replace(/--/g, "—")
            .replace(/\.\.\./g, "…")
            .replace(/  $/gm, "<br>")
            .replace(/^##(.+)$/gm, "<h2>$1</h2>")
            .replace(/^#(.+)$/gm, "<h1>$1</h1>")
            .replace(/^ {0,3}- (.+)$/gm, "<ul><li>$1</li></ul>")
            .replace(/<\/ul>\n<ul>/g, "")
            .replace(/\n\n+/g, "</p>\n<p>")
            .replace(/<p><hr><\/p>/g, "<hr>")
            .replace(/<pre>(\d+)<\/pre>/g, function (_, m) { return "<pre>" + pres[m] + "</pre>"; }) + "</p>";
    }
    function replace(element, data) {
        if (element.dataset["html"]) {
            element.innerHTML = format(data[element.dataset["html"]]);
        }
        else if (element.dataset["text"]) {
            element.innerText = data[element.dataset["text"]];
        }
        else {
            for (var i = 0; i < element.children.length; i++) {
                replace(element.children[i], data);
            }
        }
    }
    function preview() {
        var preview = document.getElementById(id);
        var data = {};
        properties.forEach(function (name) { return data[name] = value(name); });
        if (properties.filter(function (name) { return data[name]; }).length) {
            preview.style.display = "block";
            replace(preview, data);
        }
        else {
            preview.style.display = "none";
        }
    }
    function updatePreview() {
        clearTimeout(handle);
        handle = setTimeout(preview, 500);
    }
    properties.forEach(function (id) {
        document.getElementById(id).addEventListener("input", updatePreview);
    });
    preview();
}
/**
 * Implements counting characters after changes.
 * @param textId  ID of input or textarea element to count
 * @param countId ID of HTML element to display the count
 */
function setupCounting(textId, countId) {
    var text = document.getElementById(textId);
    var count = document.getElementById(countId);
    function updateCount() {
        var c = countCharacters(text.value);
        count.textContent = String(c) + " (noch " + (maxCharCount - c) + ")";
    }
    text.addEventListener("input", updateCount);
    updateCount();
}
ready(function () {
    document.getElementById("maximum").textContent = "" + maxCharCount;
    // persist all user input
    ["title", "author", "genre", "text"].forEach(storeLocally);
    setupPreview("preview", ["title", "author", "genre", "text"]);
    setupCounting("text", "count");
});
//# sourceMappingURL=app.js.map