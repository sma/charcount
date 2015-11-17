/// Calls the given function once the DOM is ready.
function ready(f: EventListener) {
	document.addEventListener("DOMContentLoaded", f);
}

/// Counts the number of non-whitespace characters. 
function countCharacters(s: string): number {
	if (!s) {
		return 0;
	}
	return s
		.replace(/\_(.*?)\_/g, "$1")
		.replace(/\*(.*?)\*/g, "$1")
		.replace(/`(.*?)`/g, "$1")
		.replace(/\s+/g, '').length;
}

/// Persists the specified input field or text area to local storage.
function storeLocally(id: string) {
	var el = <HTMLInputElement | HTMLTextAreaElement>document.getElementById(id);
	var handle: number;
	if (el) {
		el.value = localStorage.getItem(id);
		el.addEventListener("input", (e) => {
			clearTimeout(handle);
			handle = setTimeout(() => {
				localStorage.setItem(id, el.value);
			}, 500);
		});
	}
}

/// Implements the preview function.
function setupPreview(id: string, properties: string[]) {
	var handle: number;

	function value(id: string): string {
		return (<HTMLInputElement | HTMLTextAreaElement>document.getElementById(id)).value;
	}

	function format(s: string): string {
		return "<p>" + s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/\_(.*?)\_/g, "<em>$1</em>")
			.replace(/\*(.*?)\*/g, "<strong>$1</strong>")
			.replace(/`(.*?)`/g, "<code>$1</code>")
			.replace(/"\b/g, "„")
			.replace(/"/g, "“")
			.replace(/^---+/gm, "<hr>")
			.replace(/--/g, "—")
			.replace(/\.\.\./g, "…")
			.replace(/  $/gm, "<br>")
			.replace(/^#(.*)$/gm, "<h1>$1</h1>")
			.replace(/\n\n/g, "</p><p>") + "</p>";
	}

	function replace(element: HTMLElement, data: any) {
		if (element.dataset["html"]) {
			element.innerHTML = format(data[element.dataset["html"]]);
		} else if (element.dataset["text"]) {
			element.innerText = data[element.dataset["text"]];
		} else {
			for (var i = 0; i < element.children.length; i++) {
				replace(<HTMLElement>element.children[i], data);
			}
		}
	}

	function preview() {
		var preview = document.getElementById(id);
		var data = {};

		properties.forEach(name => data[name] = value(name));

		if (properties.filter(name => data[name]).length) {
			preview.style.display = "block";
			replace(preview, data);
		} else {
			preview.style.display = "none";
		}
	}

	function updatePreview() {
		clearTimeout(handle);
		handle = setTimeout(preview, 500);
	}

	properties.forEach(id => {
		document.getElementById(id).addEventListener("input", updatePreview);
	});

	preview();
}

/// Implements counting characters.
function setupCount(textId: string, countId: string) {
	var text = <HTMLTextAreaElement>document.getElementById(textId);
	var count = <HTMLSpanElement>document.getElementById(countId);

	function updateCount() {
		count.textContent = String(countCharacters(text.value));
	}

	text.addEventListener("input", updateCount);

	updateCount();
}

ready(() => {
	// persist all user input
	["title", "author", "genre", "text"].forEach(storeLocally);

	setupPreview("preview", ["title", "author", "genre", "text"]);

	setupCount("text", "count");
});
