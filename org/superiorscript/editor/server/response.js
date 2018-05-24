var exports = module.exports = {};

class Response {

	constructor(success, userMessage, devMessage){
		this.success = success;
		this.message = userMessage;
		this.devMessage = devMessage;
		this.data = {};
	}
}

exports.Response = Response;
