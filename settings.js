let localSettings;
try {
	localSettings = require("./local-settings");
}
catch {
	localSettings = {};
}

const settings = {
	PUBLIC_BACKEND_API_URL: "/api",
	PORT: 3000,
	HOSTNAME: "localhost",

	...localSettings
};

module.exports = settings;
