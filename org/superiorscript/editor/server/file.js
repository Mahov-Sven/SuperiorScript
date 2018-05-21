var exports = module.exports = {};

const fs = require("fs");

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));

exports.readFile = async function(fileName){
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, function(err, data){
			if (err){
				reject({error: err, isLocal: true});
			} else {
				resolve(data);
			}
		});
	}).catch((e) => {
		if(e.isLocal) Logger.warn("File", e.error);
		else throw e;
	});
}
