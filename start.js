const settings = require("./settings");
const {spawn} = require("child_process");

const mode = process.argv[2];
const args = `-p ${settings.PORT} -H ${settings.HOSTNAME}`;

let command;
switch (mode) {
	case "development":
		command = "npx next dev " + args;
		break;
	case "build":
		command = "npx next build";
		break;
	case "production":
	default:
		command = "npx next start " + args;
		break;
}

const proc = spawn(command, {
	shell: true
});

proc.stdout.on("data", data => console.log(data.toString()));
proc.stderr.on("data", data => console.error(data.toString()));
