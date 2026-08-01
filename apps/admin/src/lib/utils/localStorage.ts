const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";

export const loadAccessToken = () => {
	try {
		return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
	} catch (err) {
		console.error("Could not load access token", err);
		return null;
	}
};

export const saveAccessToken = (token: string) => {
	try {
		localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
	} catch (err) {
		console.error("Could not save access token", err);
	}
};

export const removeAccessToken = () => {
	try {
		localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
	} catch (err) {
		console.error("Could not remove access token", err);
	}
};
