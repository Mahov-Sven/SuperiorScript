const Http = require("http");
const Url = require("url");
const Path = require("path");
const MongoClient = require("mongodb").MongoClient;

const filePath = (path) => "../../" + path;

const Globals = require(filePath("editor/server/globals"));
const Compiler = require(filePath("compile/compiler"));
const File = require(filePath("editor/server/file"));
const Logger = require(filePath("editor/server/logger"));
const Database = require(filePath("editor/server/database"));

Http.createServer(function(request, resource){
	handleRequest(request, resource);
}).listen(8080);

async function handleRequest(request, resource){
	const queue = Url.parse(request.url, true);

	resource.json = (obj) => resource.write(JSON.stringify(obj));

	switch(queue.pathname){
		case "/editor":
			await openPage_Editor(request, resource, queue);
			break;
		case "/login":
			await openData_Login(request, resource, queue);
			break;
		default:
			await openPage_Unknown(request, resource, queue);
			break;
	}

	resource.end();
}

Logger.log("Server", "Running on Port 8080...");

async function openPage_Editor(request, resource){
	const data = await File.readFile(filePath("editor/html/index.html"));
	resource.writeHead(200, {'Content-Type': 'text/html'});
	resource.write(data);
}

async function openData_Login(request, resource, queue){
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

	const database = new Database();

	try {
		await database.connect();
	} catch(err) {
		if(err) return Logger.log("Database", err, true, true);
	}

	Logger.log("Database", "Successfully created");

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
		database.switchTo("users");

		try {
			await database.insert(user);
		} catch(err) {
			if(err) return Logger.log("Database", err, true, true);
		}

		Logger.log("Database", "User added to 'user' collection");
	}

	database.close();
	resource.json(response);
}

async function openPage_Unknown(request, resource, queue){
	const path = queue.pathname.substr(1);
	const regex = /(?:\.([^.]+))?$/;
	const fileExtension = regex.exec(path)[1];

	let error = false;
	let output = "";

	const data = await File.readFile(path);

	output += `"${filePath(path)}"`;

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
		error = false;
	} else {
		error = true;
	}

	Logger.log("File", output, error);
}
