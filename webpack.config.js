const path = require("path");

module.exports = {
	resolve: {
		alias: {
			Api: path.resolve(__dirname, "src/api"),
			Components: path.resolve(__dirname, "src/components"),
			Configs: path.resolve(__dirname, "src/configs"),
			Constants: path.resolve(__dirname, "src/constants"),
			Hooks: path.resolve(__dirname, "src/hooks"),
			Modules: path.resolve(__dirname, "src/modules"),
			Types: path.resolve(__dirname, "src/types"),
			Styles: path.resolve(__dirname, "src/styles"),
			Utils: path.resolve(__dirname, "src/utils"),
		}
	}
};

