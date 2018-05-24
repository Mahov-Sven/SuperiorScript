var exports = module.exports = {};

class PromiseError {

	constructor(error){
		this.isPromise = true;
		this.error = error;
	}
}

exports.PromiseError = PromiseError;
