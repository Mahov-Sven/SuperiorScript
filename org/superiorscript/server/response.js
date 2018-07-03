var exports = module.exports = {};

class Response {

	constructor(success, userMessage, devMessage, data={}){
		this.success = success;
		this.message = userMessage;
		this.devMessage = devMessage;
		this.data = data;
	}
}

exports.Response = Response;
