const http = require("http");
const url = require("url");
const path = require("path");
const file = require("fs");

function filePath(path){
	return "../../" + path;
}

const spsCompiler = require(filePath("compile/compiler"));

http.createServer((request, resource) => {

	const queue = url.parse(request.url, true);

	switch(queue.pathname){
		case "/editor":
			openPage_Editor(request, resource);
			break;
		default:
			openPage_Unknown(request, resource, queue.pathname.substr(1));
			break;
	}
}).listen(8080);

console.log("Server Running on Port 8080...");

function openPage_Editor(request, resource){
	file.readFile(filePath("editor/html/index.html"), (error, data) => {
		resource.writeHead(200, {'Content-Type': 'text/html'});
		resource.write(data);
		resource.end();
	});
}

function openPage_Unknown(request, resource, path){

	const regex = /(?:\.([^.]+))?$/;
	const fileExtension = regex.exec(path)[1];

	let output = "";

	file.readFile(filePath(path), (error, data) => {

		output += `File: "${filePath(path)}"`;

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
			output += "  Success";
		} else {
			output += " Fail";
		}

		resource.end();
		console.log(output);
	});
}
