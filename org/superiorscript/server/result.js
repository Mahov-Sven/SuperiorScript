var exports = module.exports = {};

class Result {

	constructor(success, data={}, userMessage=undefined, devMessage=undefined){
		this.success = success;
		this.data = data;
		this.message = userMessage;
		this.devMessage = devMessage;
	}
}

exports.Result = Result;
