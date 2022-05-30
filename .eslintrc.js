module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true,
		"jest": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true,
		},
		"ecmaVersion": 12,
		"sourceType": "module",
	},
	"plugins": [
		"react",
		"@typescript-eslint",
		"react-hooks",
	],
	"rules": {
		"@typescript-eslint/no-explicit-any": [0],
		"@typescript-eslint/no-var-requires": 0,
		"@typescript-eslint/ban-ts-comment": 0,

		"react/jsx-indent": [2, "tab", {"indentLogicalExpressions": true}],
		"react/prop-types": [0],
		"react/display-name": ["error", {"ignoreTranspilerName": false}],

		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",

		"indent": [
			"error",
			"tab",
			{"SwitchCase": 1},
		],
		"quotes": [
			"error",
			"double",
		],
		"semi": [
			"error",
			"always",
		],
		"object-curly-spacing": ["error", "never"],
		"eol-last": ["error", "always"],
	},
	"overrides": [
		{
			// enable the rule specifically for TypeScript files
			"files": ["*.ts", "*.tsx"],
			"rules": {
				"@typescript-eslint/explicit-module-boundary-types": [0],
			},
		},
		{
			"files": ["*.js", "*.jsx"],
			"rules": {
				"@typescript-eslint/explicit-module-boundary-types": [0],
			},
		},
	],
};
