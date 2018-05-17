const fs = require("fs");

var exports = module.exports = {};

exports.readFile = async function(fileName){
	return new Promise(function(resolve, reject) {
		fs.readFile(filename, function(err, data){
			if (err){
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
