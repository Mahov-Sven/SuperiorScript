var exports = module.exports = {};

const fs = require("fs");
const Stream = require('stream');

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));

/**
 * @deprecated
 */
class MongoFile {

	constructor(fileName, database){
		this.database = database;
		this.writeStream = undefined;
		this.readStream = undefined;
		//this.id;
		//this.length;
		//this.chunkSize;
		//this.uploadDate;
		//this.md5;
		this.fileName = fileName;
		//this.contentType;
		//this.aliases;
		//this.metadata;
	}

	async _open(){
		return new Promise((resolve, reject) => {
			this.writeStream = this.database.fileSystem
				.createWriteStream({filename: this.fileName});

			this.readStream = this.database.fileSystem
				.createReadStream({filename: this.fileName});

			resolve(new Result(true));
		}).catch((e) => {
			if(e.fromPromise){
				Logger.err("MongoFile", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async open(){
		Logger.log("MongoFile", `Attempting to open file ${this.fileName} ...`);
		const result = this._open();
		if(result.success) Logger.log("MongoFile", `File ${this.fileName} opened successfully`);
		else Logger.log("MongoFile", `Attempt to open file ${this.fileName} failed`);
		return result;
	}

	async seek(index){
		// TODO
	}

	async _write(targetStream){
		let input = targetStream;
		if(!(input instanceof Stream))
			input = new Readable(input);

		input.pipe(this.writeStream);

		return new Promise((resolve, reject) => {
			this.writeStream.on("error", (error) => {
				reject(new PromiseError(error));
			});

			this.writeStream.on("finish", () => {
				resolve(new Result(true));
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.err("MongoFile", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async write(targetStream){
		Logger.log("MongoFile", `Starting write stream to file ${this.fileName} ...`);
		const result = this._write(targetStream);
		if(result.success) Logger.log("MongoFile", `Stream writing to file ${this.fileName} was successful`);
		else Logger.log("MongoFile", `Errors occured while stream writting to file ${this.fileName}`);
		return result;
	}

	async _read(targetStream){
		let output = targetStream;
		if(!(output instanceof Stream))
			output = new Writable(targetStream);

		this.readStream.pipe(output);

		return new Promise((resolve, reject) => {
			this.readStream.on("error", (error) => {
				reject(new PromiseError(error));
			});

			this.readStream.on("finish", () => {
				resolve(new Result(true, output));
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.err("MongoFile", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async read(targetStream){
		Logger.log("MongoFile", `Starting read stream from file ${this.fileName} ...`);
		const result = this._read(targetStream);
		if(result.success) Logger.log("MongoFile", `Stream reading from file ${this.fileName} was successful`);
		else Logger.log("MongoFile", `Errors occured while stream reading from file ${this.fileName}`);
		return result;
	}

	async exists(){
		// TODO
	}

	async clear(){
		// TODO
	}

	async close(){
		this.writeStream.end();
		this.readStream.end();
		this.writeStream = undefined;
		this.readStream = undefined;
	}
}

exports.MongoFile = MongoFile;
