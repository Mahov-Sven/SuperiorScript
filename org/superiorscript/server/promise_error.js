var exports = module.exports = {};

class PromiseError {

	constructor(error){
		this.fromPromise = true;
		this.error = error;
	}
}

exports.PromiseError = PromiseError;
