const Http = require("http");
const Url = require("url");

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const File = require(filePath("editor/server/file")).File;

process.on('unhandledRejection', (error) => {
	Logger.err("Server", error);
});

Http.createServer(function(request, resource){
	handleRequest(request, resource);
}).listen(8080);

async function handleRequest(request, resource){
	Logger.log("Server", "Starting to handle request");

	const queue = Url.parse(request.url, true);

	resource.json = (obj) => { if(obj) resource.write(JSON.stringify(obj)) };

	const commandRegex = /^\/[^.\/\d]+$/;
	if(commandRegex.test(queue.pathname)){

		const commandName = queue.pathname.substr(1);
		const commandPath = filePath(`editor/server/commands/${commandName}.js`);
		Logger.log("Server", `Trying to execute command ${commandName}`);
		const Command = require(commandPath).Command;
		const commandResult = await (new Command()).execute(queue.query, resource, queue, request);
		if(commandResult && !commandResult.success) Logger.warn("Server", `Execution of command ${commandName} failed`);
		resource.json(commandResult);

	} else {
		Logger.log("Server", "File requested");

		const path = queue.pathname.substr(1);
		const regex = /(?:\.([^.]+))?$/;
		const fileExtension = regex.exec(path)[1];

		const fileResult = await File.readFile(path);

		switch (fileExtension) {
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

		if(fileResult.success) resource.write(fileResult.data);
	}

	resource.end();

	Logger.log("Server", "Done handling request");
}

Logger.log("Server", "Running on Port 8080...");
