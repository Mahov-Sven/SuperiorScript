var exports = module.exports = {};

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const Command = require(filePath("editor/server/commands/command")).Command;
const File = require(filePath("editor/server/file")).File;

class editor extends Command {

	constructor(){
		super();

		this.options = {};
	}

	async execute(query, resource){
		Logger.log("Editor", "Page requested");
		const fileResult = await File.readFile("editor/html/index.html");
		if(!fileResult.success) {
			Logger.err("Editor", fileResult.data.error);
			return new Result(
				false,
				{},
				"The editor could not be loaded.",
				"The editor index file could not be read."
			);
		}

		resource.writeHead(200, {'Content-Type': 'text/html'});
		resource.write(fileResult.data);
		Logger.log("Editor", "Page loaded")
		return;
	}
}

exports.Command = editor;
