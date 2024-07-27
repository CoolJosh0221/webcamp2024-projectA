import { getWorkList, setWorkList, getUuidDict, setUuidDict, getNoteContent, setNoteContent } from './storageHelpers.js';

function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

function getKeyByValue(object, value) {
	return Object.keys(object).find((key) => object[key] === value);
}

document.addEventListener('DOMContentLoaded', () => {
	const noteContentElement = document.getElementById('note-content');
	const noteUUID = getQueryParam('s');

	// Load note content from localStorage
	const savedContent = getNoteContent(noteUUID);
	noteContentElement.value = savedContent;

	// Save note content to localStorage on change
	noteContentElement.addEventListener('input', () => {
		setNoteContent(noteUUID, noteContentElement.value);
		// localStorage.setItem(noteUUID, noteContentElement.value);
		// console.log(`Set ${noteName} to ${noteContentElement.value}`);
	});
});
