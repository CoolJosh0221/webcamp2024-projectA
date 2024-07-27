export const getLocalStorageItem = (key, defaultValue) => {
	const item = localStorage.getItem(key);
	return item ? JSON.parse(item) : defaultValue;
};

export const setLocalStorageItem = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const getWorkList = () => getLocalStorageItem('work-list', []);
export const setWorkList = (list) => setLocalStorageItem('work-list', list);

export const getUuidDict = () => getLocalStorageItem('uuid-dict', {});
export const setUuidDict = (dict) => setLocalStorageItem('uuid-dict', dict);

export const getNoteContent = (uuid) => getLocalStorageItem(uuid, '');
export const setNoteContent = (uuid, content) => setLocalStorageItem(uuid, content);
