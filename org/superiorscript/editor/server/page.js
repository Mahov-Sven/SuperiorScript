var exports = module.exports = {};

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Compiler = require(filePath("compile/compiler"));
const File = require(filePath("editor/server/file"));
const Logger = require(filePath("editor/server/logger"));
const Response = require(filePath("editor/server/response")).Response;
const Database = require(filePath("editor/server/database")).Database;

exports.editor = async function(request, resource){
	Logger.log("Page", "Editor page requested");

	const data = await File.readFile(filePath("editor/html/index.html"));
	resource.writeHead(200, {'Content-Type': 'text/html'});
	resource.write(data);
}

exports.clear = async function(request, resource, queue){
	Logger.log("Page", "Collection clear requested...");

	const collectionName = queue.query.collection || queue.query.c;
	const developer = queue.query.developer || queue.query.d;
	const databaseName = developer ? databases.developer : databases.production;

	const database = new Database(databaseName, collectionName);
	await database.open();

	if(collectionName === undefined){
		// TODO clear all collections if not specified
		Logger.log("Page", "Collection not given");

		const response = new Response(
			false,
			`No collection name was given`,
			`The given collection name was undefined`
		);
		resource.json(response);
		return await database.close();
	}

	await database.clear();

	Logger.log("Page", "Collection clear completed");

	const response = new Response(
		true,
		`Collection ${collectionName} in database ${databaseName} has been cleared`,
		`All entries in database ${databaseName} collection ${collectionName} have been removed`
	);
	resource.json(response);
	return await database.close();
}

exports.register = async function(request, resource, queue){
	Logger.log("Page", "Account registration requested");

	const username = queue.query.username || queue.query.u;
	const password = queue.query.password || queue.query.p;
	const developer = queue.query.developer || queue.query.d;
	const databaseName = developer ? databases.developer : databases.production;

	const database = new Database(databaseName);
	await database.open();
	await database.switchToCollection(collections.users);

	const user = {};

	/* Test username */
	Logger.log("Page", "Testing given username...");
	user.username = username;

	if(username === undefined){
		const response = new Response(
			false,
			"Your account is missing a username",
			"Undefined username given"
		);
		resource.json(response);
		return await database.close();
	}

	//await database.clear();

	// TODO ensure username meets some standard

	const resultUser = await database.find(user);
	if(resultUser.success){
		const response = new Response(
			false,
			"That username has already been taken",
			`At least 1 user matches given username in the database ${databaseName}`
		);
		resource.json(response);
		return await database.close();
	}

	Logger.log("Page", "Given username passed tests");

	/* Test password */
	Logger.log("Page", "Testing given password...");
	user.password = password;

	// TODO ensure password meets some standard

	Logger.log("Page", "Given password passed tests");

	/* Add user */
	Logger.log("Page", `Adding user to database ${databaseName}`);
	await database.add(user);

	/* Create token */
	Logger.log("Page", `Creating token for user`);
	const resultToken = await database.addToken({user:{username:username}});

	const response = new Response(
		true,
		"Your account has been successfully registered",
		`login token created for given username in the database ${databaseName}`
	);
	response.data.token = resultToken.data.token;
	response.data.user = resultToken.data.object.user;
	resource.json(response);
	return await database.close();
}

exports.login = async function(request, resource, queue){
	Logger.log("Page", "Login requested");

	const username = queue.query.username || queue.query.u;
	const password = queue.query.password || queue.query.p;
	const developer = queue.query.developer || queue.query.d;
	const token = queue.query.token || queue.query.t;
	const databaseName = developer ? databases.developer : databases.production;

	const database = new Database(databaseName);
	await database.open();

	/* Try to match token */
	if(token != undefined){
		Logger.log("Page", "Trying to match given token with user");
		const resultToken = await database.findToken(token);
		if(resultToken.success){
			const response = new Response(
				true,
				"Account login successful",
				`Token matched in the database ${databaseName}`
			);
			response.data.token = resultToken.data.token;
			response.data.user = resultToken.data.object.user;
			resource.json(response);
			return await database.close();
		}
	}
	else Logger.log("Page", "No token given");

	Logger.log("Page", "Testing to ensure username and password were provided");
	if(username === undefined || password === undefined){
		const response = new Response(
			false,
			"Username or password missing",
			"Either username or password was undefined"
		);
		resource.json(response);
		return await database.close();
	}

	if(username.toLowerCase() === "guest"){
		Logger.log("Page", "User logging in with guest account");
		Logger.log("Page", "Retrieving/Updating guest account token");
		const resultToken = await database.addToken({user:{username:username}});

		const response = new Response(
			true,
			"Guest login successful",
			"Username used matched to guest username"
		);
		response.data.token = resultToken.data.token;
		response.data.user = resultToken.data.object.user;
		resource.json(response);
		return await database.close();

	} else {
		Logger.log("Page", "User logging in with non-guest account");
		const user = {};
		user.username = username;
		user.password = password;

		Logger.log("Page", `Searching for user account in database ${databaseName}`);
		await database.switchToCollection(collections.users);
		const resultUser = await database.find(user);

		if(!resultUser.success){
			Logger.log("Page", "User account not found for given username and password");

			const response = new Response(
				false,
				"The username or password are incorrect",
				`The specific combination of the given username and password could not be found in the database ${databaseName}`
			);
			resource.json(response);
			return await database.close();
		}
		else Logger.log("Page", "User account found");

		Logger.log("Page", "Retrieving/Updating user account token");
		const resultToken = await database.addToken({user:{username:username}});

		const response = new Response(
			true,
			"Login successful",
			`User found in the database ${dbName}`
		);
		response.data.token = resultToken.data.token;
		response.data.user = resultToken.data.object.user;
		resource.json(response);
		return await database.close();
	}
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
