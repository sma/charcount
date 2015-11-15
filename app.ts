
/// Calls the given function once the DOM is ready.
function ready(f: EventListener) {
	document.addEventListener("DOMContentLoaded", f);
}

/// Counts the number of non-whitespace characters. 
function countCharacters(s: string): number {
	if (!s) {
		return 0;
	}
	return s.replace(/\s+/g, '').length;
}

/// Persists the specified input field or text area to local storage.
function storeLocally(id: string) {
	var el = <HTMLInputElement|HTMLTextAreaElement> document.getElementById(id);
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

ready(() => {
	// persist all user input
	["title", "author", "genre", "text"].forEach(storeLocally);
	
	// setup character counting
	var text = <HTMLTextAreaElement> document.getElementById("text");
	var count = <HTMLSpanElement> document.getElementById("count");
	
	function updateCount() {
		count.textContent = String(countCharacters(text.value));
	}
	
	text.addEventListener("input", updateCount);
	updateCount();
});
