var exports = module.exports = {};

const filePath = (path) => "../../" + path;
const Globals = require(filePath("server/globals"));
const Logger = require(filePath("server/logger"));
const Result = require(filePath("server/result")).Result;
const CommandI = require(filePath("server/commands/commandI")).CommandI;
const File = require(filePath("server/file"));

class Manager extends CommandI {

	constructor(){
		super();

		this.options = {};
	}

	async execute(query, resource){
		Logger.log("Manager", "Page requested");
		const fileResult = await File.readFile("manager/html/index.html");
		if(!fileResult.success) {
			Logger.err("Manager", fileResult.data.error);
			return new Result(
				false,
				{},
				"The manager could not be loaded.",
				"The manager index file could not be read."
			);
		}

		resource.writeHead(200, {'Content-Type': 'text/html'});
		resource.write(fileResult.data);
		Logger.log("Manager", "Page loaded")
		return;
	}
}

exports.Command = Manager;
