const Http = require("http");
const Url = require("url");

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Page = require(filePath("editor/server/page"));

process.on('unhandledRejection', (error) => {
	Logger.err("Server", error);
});

Http.createServer(function(request, resource){
	handleRequest(request, resource);
}).listen(8080);

async function handleRequest(request, resource){
	Logger.log("Server", "Starting to handle request...");

	const queue = Url.parse(request.url, true);

	resource.json = (obj) => resource.write(JSON.stringify(obj));

	switch(queue.pathname){
		case "/editor":
			await Page.editor(request, resource, queue);
			break;
		case "/clear":
			await Page.clear(request, resource, queue);
			break;
		case "/register":
			await Page.register(request, resource, queue);
			break;
		case "/login":
			await Page.login(request, resource, queue);
			break;
		case "/file":
			await Page.file(request, resource, queue);
			break;
		default:
			await Page.unknown(request, resource, queue);
			break;
	}

	resource.end();

	Logger.log("Server", "Done handling request");
}

Logger.log("Server", "Running on Port 8080...");
