export const persistLayout = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error("Could not save layout to localStorage", e);
	}
};

export const getLayout = (key) => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (e) {
		return null;
	}
};
