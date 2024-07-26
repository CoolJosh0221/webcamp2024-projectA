// index.js

// DOM Elements
const addButton = document.getElementById('add-button');
const workInput = document.getElementById('work-input');
const workList = document.getElementById('work-list');

// Local Storage Helpers
const getLocalStorageItem = (key, defaultValue) => {
	const item = localStorage.getItem(key);
	return item ? JSON.parse(item) : defaultValue;
};

const setLocalStorageItem = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

// Work List Operations
const getWorkList = () => getLocalStorageItem('work-list', []);
const setWorkList = (list) => setLocalStorageItem('work-list', list);

const getUuidDict = () => getLocalStorageItem('uuid-dict', {});
const setUuidDict = (dict) => setLocalStorageItem('uuid-dict', dict);

const isNameDuplicated = (workName) => getWorkList().includes(workName);

// UI Creation
const createButton = (text, className, onClick) => {
	const button = document.createElement('button');
	button.textContent = text;
	button.type = 'button';
	button.className = `btn ${className}`;
	button.onclick = onClick;
	return button;
};

const createWorkItem = (workName) => {
	const workContainer = document.createElement('div');
	workContainer.className = 'work-item';

	const workDisplay = document.createElement('p');
	workDisplay.textContent = `作品名稱: ${workName}`;
	workDisplay.className = 'work-name';

	const renameButton = createButton('重新命名', 'btn-primary', () => renameWork(workDisplay));
	const enterButton = createButton('進入', 'btn-primary', () => enterWork(workName));
	const removeButton = createButton('刪除', 'btn-primary', () => removeWork(workContainer, workName));

	workContainer.append(workDisplay, renameButton, enterButton, removeButton);
	workList.appendChild(workContainer);
};

// Work Operations
const addWork = () => {
	const workName = workInput.value.trim();
	if (workName && !isNameDuplicated(workName)) {
		const workList = getWorkList();
		workList.push(workName);
		setWorkList(workList);

		const uuidDict = getUuidDict();
		uuidDict[workName] = crypto.randomUUID();
		setUuidDict(uuidDict);

		createWorkItem(workName);
		workInput.value = '';
	} else {
		alert('作品名稱重複或為空白，請重新輸入');
	}
};

const renameWork = (workDisplay) => {
	const oldName = workDisplay.textContent.split(': ')[1];
	const newName = prompt('請輸入新的作品名稱:', oldName);
	if (newName === null || newName === oldName) return;

	if (newName && !isNameDuplicated(newName)) {
		workDisplay.textContent = `作品名稱: ${newName}`;

		const workList = getWorkList();
		const index = workList.indexOf(oldName);
		workList[index] = newName;
		setWorkList(workList);

		const uuidDict = getUuidDict();
		uuidDict[newName] = uuidDict[oldName];
		delete uuidDict[oldName];
		setUuidDict(uuidDict);

		const enterButton = workDisplay.nextElementSibling.nextElementSibling;
		enterButton.onclick = () => enterWork(newName);
	} else {
		alert('作品名稱重複或為空白，請重新輸入');
	}
};

const enterWork = (workName) => {
	const currentUrl = window.location.href;
	const newUrl = new URL(currentUrl.replace('index.html', 'notes.html'));
	const uuidDict = getUuidDict();
	newUrl.searchParams.append('s', uuidDict[workName]);
	window.open(newUrl, '');
};

const removeWork = (workContainer, workName) => {
	if (confirm('確定刪除？此步驟無法復原。')) {
		workContainer.remove();

		const workList = getWorkList();
		const index = workList.indexOf(workName);
		workList.splice(index, 1);
		setWorkList(workList);

		const uuidDict = getUuidDict();
		delete uuidDict[workName];
		setUuidDict(uuidDict);
	}
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	getWorkList().forEach(createWorkItem);
});

addButton.addEventListener('click', addWork);
