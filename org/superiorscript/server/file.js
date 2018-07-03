var exports = module.exports = {};

const FileSystem = require("fs");

const filePath = (path) => "../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;

exports.readFile = function(fileName){
	Logger.log("File", `Reading file ${fileName}`);
	try {
		const data = FileSystem.readFileSync(fileName);
		return new Result(true, data);
	} catch (e) {
		return new Result(false, {error: e});
	}
}
