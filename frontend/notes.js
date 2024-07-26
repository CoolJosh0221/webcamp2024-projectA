function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', () => {
	const noteContentElement = document.getElementById('note-content');
	const noteUUID = getQueryParam('s');

	// Load note content from localStorage
	const savedContent = localStorage.getItem(noteUUID) || '';
	noteContentElement.value = savedContent;

	// Save note content to localStorage on change
	noteContentElement.addEventListener('input', () => {
		localStorage.setItem(noteUUID, noteContentElement.value);
		// console.log(`Set ${noteName} to ${noteContentElement.value}`);
	});
});
