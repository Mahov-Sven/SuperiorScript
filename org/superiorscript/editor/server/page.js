var exports = module.exports = {};

const Encryption = require("crypto");

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

exports.register = async function(request, resource, queue){
	Logger.log("Page", "Account registration requested");

	const username = queue.query.username || queue.query.u;
	const password = queue.query.password || queue.query.p;
	const developer = queue.query.developer || queue.query.d;
	const dbName = developer ? databases.test : databases.production;
	//TODO use a token

	const response = {};
	const database = new Database(dbName);
	await database.open();
	await database.switchToCollection(collections.users);

	const user = {};

	/* Test username */
	user.username = username;

	if(username === undefined){
		response.error = true;
		response.message = "Missing username";
		resource.json(response);
		return;
	}

	await database.clear();

	// TODO ensure username meets some standard

	const result = await database.find(user);
	if(result.length > 0){
		response.error = true;
		response.message = "Username has already been taken";
		resource.json(response);
		return;
	}

	/* Test password */
	user.password = password;

	// TODO ensure password meets some standard

	/* Add user */
	await database.add(user);
	response.error = false;

	/* Create token */
	const tokenObj = {};
	tokenObj.token = Encryption
		.createHash("sha1")
		.update((new Date()).toString() + Math.random().toString())
		.digest("hex");

	tokenObj.date = new Date();
	tokenObj.username = username;
	tokenObj.ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;

	await database.switchToCollection(collections.tokens);
	await database.clear();
	await database.add(tokenObj);
	response.token = tokenObj.token;
	response.user = username;

	await database.close();
	resource.json(response);
}

exports.login = async function(request, resource, queue){
	Logger.log("Page", "Login requested");

	const username = queue.query.username || queue.query.u;
	const password = queue.query.password || queue.query.p;
	const developer = queue.query.developer || queue.query.d;
	const token = queue.query.token || queue.query.t;
	const dbName = developer ? databases.test : databases.production;

	const response = {};
	const database = new Database(dbName);
	await database.open();

	//TODO use a token
	/* Try to match token */
	if(token != undefined){
		await database.switchToCollection(collections.tokens);

		const tokenObj = {};
		tokenObj.token = token;
		tokenObj.ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;

		const result = (await database.find(tokenObj))[0];
		if(result != undefined){
			const timeDiff = (new Date()).getTime() - result.date.getTime();
			if(timeDiff < tokenLifetime){
				response.error = false;
				response.token = result.token;
				response.user = result.username;
				resource.json(response);
				return;
			}else {
				await database.remove(tokenObj);
			}
		}

	}



	if(username === undefined || password === undefined){
		response.error = true;
		response.message = "Missing username or password";
		resource.json(response);
		return;
	}

	response.error = false;

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

		await database.switchToCollection(collections.users);
		//await database.clear();

		const result = await database.find(user);
		console.log(result);
	}

	await database.close();
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
