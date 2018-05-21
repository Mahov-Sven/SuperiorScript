var exports = module.exports = {};

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Compiler = require(filePath("compile/compiler"));
const File = require(filePath("editor/server/file"));
const Logger = require(filePath("editor/server/logger"));
const Database = require(filePath("editor/server/database")).Database;

exports.editor = async function(request, resource){
	Logger.log("Page", "Editor page requested");

	const data = await File.readFile(filePath("editor/html/index.html"));
	resource.writeHead(200, {'Content-Type': 'text/html'});
	resource.write(data);
}

exports.login = async function(request, resource, queue){
	Logger.log("Page", "Login requested");

	const username = queue.query.username || queue.query.u;
	const password = queue.query.password || queue.query.p;
	const developer = queue.query.developer || queue.query.d;
	const dbName = developer ? databases.test : databases.production;
	//TODO use a token

	const response = {};

	if(username === undefined || password === undefined){
		response.error = true;
		response.message = "Missing username or password";
		resource.json(response);
		resource.end();
		return;
	}

	response.error = false;

	const database = new Database(dbName);
	await database.open();

	if(username.toLowerCase() !== "guest"){
		//TODO non-guest login
		response.username = username;
		response.password = password;
		response.message = "User Login";
	} else {
		response.message = "Guest Login";
		const user = {};
		user.username = username;
		user.password = "None";

		database.switchToCollection(collections.users);
		//await database.clear();

		const result = await database.find(user);
		console.log(result);
	}

	database.close();
	resource.json(response);
}

exports.unknown = async function(request, resource, queue){
	Logger.log("Page", "Unknown page requested");

	const path = filePath(queue.pathname.substr(1));
	const regex = /(?:\.([^.]+))?$/;
	const fileExtension = regex.exec(path)[1];

	let output = `"${path}"`;

	const data = await File.readFile(path);

	switch (fileExtension) {
		case "js":
			resource.writeHead(200, {'Content-Type': 'text/javascript'});
			output += " Type: JS";
			break;
		case "css":
			resource.writeHead(200, {'Content-Type': 'text/css'});
			output += " Type: CSS";
			break;
		default:
			resource.writeHead(200, {'Content-Type': 'text/plain'});
			output += " Type: Plain";
			break;
	}

	if(data != undefined) {
		resource.write(data);
		Logger.log("Page", output);
	}
}
