var exports = module.exports = {};

const fs = require("fs");

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const PromiseError = require(filePath("editor/server/promise_error")).PromiseError;

class File {

	constructor(fileName, database){
		this.database = database;
		this.fd = undefined;
		this.data = {}
		this.fileName = fileName;
		this._id = undefined;
		this.isOpen = false;
	}

	open(){
		let result = this.database.find({

		});

		if(result.success) this.data = result.data;
		else this.data = this.database.add({
		}).data;

		Logger.log("File", `Opening file ${fileName}`);
		this.fd = fs.openSync(this.data.fileName, "a+");

		this.data.isOpen = true;
		this.database.update({
			// find object
		},{
			// update information
		});
	}

	truncate(length=0){
		Logger.log("File", `Truncating file ${fileName}`);
		fs.ftruncateSync(this.fd, length);
	}

	close(){
		Logger.log("File", `Closing file ${fileName}`);
		fs.closeSync(this.fd);
		this.fd = undefined;
	}

	static async readFile(fileName) {
		fileName = "../../" + fileName;
		Logger.log("File", `Reading file ${fileName}`);
		try {
			const data = fs.readFileSync(fileName);
			return new Result(true, data);
		} catch (e) {
			return new Result(false, {error: e});
		}
	}
}

exports.File = File;
