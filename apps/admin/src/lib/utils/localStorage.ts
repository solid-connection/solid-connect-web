const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
const LEGACY_ACCESS_TOKEN_KEY = "accessToken";

const removeLegacyToken = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.error(`Could not remove legacy token: ${key}`, err);
	}
};

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
		removeLegacyToken(LEGACY_ACCESS_TOKEN_KEY);
	} catch (err) {
		console.error("Could not save access token", err);
	}
};

export const removeAccessToken = () => {
	try {
		localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
		removeLegacyToken(LEGACY_ACCESS_TOKEN_KEY);
	} catch (err) {
		console.error("Could not remove access token", err);
	}
};
