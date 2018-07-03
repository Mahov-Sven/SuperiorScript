const Http = require("http");
//const Url = require("url");
const WebSocket = require("ws");

const filePath = (path) => "../" + path;
const Globals = require(filePath("server/globals"));
const Logger = require(filePath("server/logger"));
const CommandI = require(filePath("server/commands/commandI")).CommandI;
const File = require(filePath("server/file"));

async function handleCommand(commandQuery, resource){
	Logger.log("Server", "Starting to handle command");

	const commandArray = commandRegex.exec(commandQuery);
	const commandName = commandArray[1];
	const commandPath = filePath(`server/commands/${commandName}.js`);
	const commandOptionObj = {};
	if(commandArray[3]){
		const commandOptionArray = commandArray[3].split('&');

		commandOptionArray.forEach((elem) => {
			const optionArray = elem.split('=');
			commandOptionObj[optionArray[0]] = optionArray[1];
		});
	}
	const commandOptions = CommandI.separateOptions(commandOptionObj);

	Logger.log("Server", `Trying to execute command ${commandName}`);
	const Command = require(commandPath).Command;
	if(!commandOptions.success) return commandOptions;
	const commandResult = await (new Command()).execute(commandOptions.data, resource);
	if(commandResult && !commandResult.success) Logger.warn("Server", `Execution of command ${commandName} failed`);
	return commandResult;
}

process.on('unhandledRejection', (error) => {
	Logger.err("Server", error);
});

const httpServer = Http.createServer(handleHTTPRequest);
const webSocketServer = new WebSocket.Server({ server: httpServer });

async function handleHTTPRequest(request, resource){
	Logger.log("Server", "Starting to handle HTTP request");
	resource.json = (obj) => { if(obj) resource.write(JSON.stringify(obj)) };

	try {
		const commandResult = await handleCommand(request.url, resource);
		resource.json(commandResult);
	} catch(e) {
		const readFilePath = request.url.substring(1);
		const readFileExtension = /(?:\.([^.]+))?$/.exec(readFilePath)[1];
		Logger.log("Server", `Command not found; trying to read file ${readFilePath} instead`);

		switch (readFileExtension) {
			case "js":
				resource.writeHead(200, {'Content-Type': 'text/javascript'});
				break;
			case "css":
				resource.writeHead(200, {'Content-Type': 'text/css'});
				break;
			default:
				resource.writeHead(200, {'Content-Type': 'text/plain'});
				break;
		}
		const fileResult = File.readFile(filePath(readFilePath));
		if(!fileResult.success) Logger.warn("Server", `Requested file ${readFilePath} not found`);
		else resource.write(fileResult.data);
	}


	resource.end();
	Logger.log("Server", "Done handling HTTP request");
}

async function handleWebSocketRequest(message){
	Logger.log("Server", "Starting to handle WebSocket request");

	Logger.log("Server", "Done handling WebSocket request");
}

webSocketServer.on("connection", (webSocket) => {
	webSocket.on("message", handleWebSocketRequest);

	webSocket.send("Hello");
	console.log("Hello");
});

httpServer.listen(8080);
Logger.log("Server", "Running on Port 8080...");
