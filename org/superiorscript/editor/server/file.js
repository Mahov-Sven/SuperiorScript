var exports = module.exports = {};

const fs = require("fs");

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const PromiseError = require(filePath("editor/server/promise_error")).PromiseError;


exports.readFile = async function(fileName){
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, function(error, data){
			if (err){
				reject(new PromiseError(error));
			} else {
				resolve(data);
			}
		});
	}).catch((e) => {
		if(e.isPromise){
			Logger.err("File", e.error);
			return new Result(false);
		}
		else throw e;
	});
}

exports.writeFile = async function(fileName, contents){
	return new Promise(function(resolve, reject) {
		fs.writeFile(fileName, contents, function(error){
			if (err){
				reject(new PromiseError(error));
			} else {
				resolve(true);
			}
		});
	}).catch((e) => {
		if(e.isPromise){
			Logger.err("File", e.error);
			return new Result(false);
		}
		else throw e;
	});
}
