const addButton = document.getElementById('add-button');

const isNameDuplicated = (workName) => {
	let workList = localStorage.getItem('work-list');
	workList = workList ? JSON.parse(workList) : [];
	return workList.includes(workName);
};

const createWorkItem = (workName) => {
	const workContainer = document.createElement('div');
	workContainer.className = 'work-item';
	const workDisplay = document.createElement('p');
	workDisplay.textContent = `作品名稱: ${workName}`;
	workDisplay.className = 'work-name';

	const renameButton = document.createElement('button');
	renameButton.textContent = '重新命名';
	renameButton.type = 'button';
	renameButton.className = 'btn btn-primary';
	renameButton.onclick = function () {
		const oldName = workDisplay.textContent.split(': ')[1];
		const newName = prompt('請輸入新的作品名稱:', workDisplay.textContent.split(': ')[1]);
		if (newName === null) return;
		let workList = localStorage.getItem('work-list');
		workList = workList ? JSON.parse(workList) : [];

		let uuidDict = localStorage.getItem('uuid-dict');
		uuidDict = uuidDict ? JSON.parse(uuidDict) : {};

		if (newName && !isNameDuplicated(newName)) {
			workDisplay.textContent = `作品名稱: ${newName}`;
			let index = workList.indexOf(oldName);
			workList[index] = newName;

			uuidDict[newName] = uuidDict[oldName];
			delete uuidDict[oldName];

			localStorage.setItem('work-list', JSON.stringify(workList));
			localStorage.setItem('uuid-dict', JSON.stringify(uuidDict));
		} else {
			alert('作品名稱重複或為空白，請重新輸入');
		}
	};

	const enterButton = document.createElement('button');
	enterButton.textContent = '進入';
	enterButton.type = 'button';
	enterButton.className = 'btn btn-primary';
	enterButton.onclick = function () {
		let currentUrl = window.location.href;
		let newUrl = new URL(currentUrl.replace('index.html', 'notes.html'));

		let uuidDict = localStorage.getItem('uuid-dict');
		uuidDict = uuidDict ? JSON.parse(uuidDict) : {};

		newUrl.searchParams.append('s', uuidDict[workDisplay.textContent.split(': ')[1]]);

		localStorage.setItem('uuid-dict', JSON.stringify(uuidDict));

		window.open(newUrl, '');
	};

	const removeButton = document.createElement('button');
	removeButton.textContent = '刪除';
	removeButton.type = 'button';
	removeButton.className = 'btn btn-primary';
	removeButton.onclick = function () {
		if (confirm('確定刪除？此步驟無法復原。')) {
			workContainer.remove();
			let workList = localStorage.getItem('work-list');
			workList = workList ? JSON.parse(workList) : [];
			let index = workList.indexOf(workName);
			workList.splice(index, 1);

			let uuidDict = localStorage.getItem('uuid-dict');
			uuidDict = uuidDict ? JSON.parse(uuidDict) : {};

			delete uuidDict[workDisplay.textContent.split(': ')[1]];

			localStorage.setItem('work-list', JSON.stringify(workList));
			localStorage.setItem('uuid-dict', JSON.stringify(uuidDict));
		}
	};

	workContainer.appendChild(workDisplay);
	workContainer.appendChild(renameButton);
	workContainer.appendChild(enterButton);
	workContainer.appendChild(removeButton);
	document.getElementById('work-list').appendChild(workContainer);
};

document.addEventListener('DOMContentLoaded', () => {
	let workList = localStorage.getItem('work-list');
	workList = workList ? JSON.parse(workList) : [];
	workList.forEach((work) => {
		createWorkItem(work);
	});
});

addButton.addEventListener('click', () => {
	const input = document.getElementById('work-input');
	const workName = input.value;
	if (workName && !isNameDuplicated(workName)) {
		// store the work name in local storage
		let workList = localStorage.getItem('work-list');
		workList = workList ? JSON.parse(workList) : [];
		workList.push(workName);

		let uuidDict = localStorage.getItem('uuid-dict');
		uuidDict = uuidDict ? JSON.parse(uuidDict) : {};
		uuidDict[workName] = crypto.randomUUID();

		localStorage.setItem('work-list', JSON.stringify(workList));
		localStorage.setItem('uuid-dict', JSON.stringify(uuidDict));

		createWorkItem(workName);
		input.value = '';
	} else {
		alert('作品名稱重複或為空白，請重新輸入');
	}
});
