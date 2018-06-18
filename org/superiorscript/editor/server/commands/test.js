var exports = module.exports = {};

const filePath = (path) => "../../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const Command = require(filePath("editor/server/commands/command")).Command;

class test extends Command {

	constructor(){
		super();

		this.options = [
			[commandOptions.username, true],
			[commandOptions.token, false],
		];
	}

	async execute(query){
		const optionResult = this._separateOptions(query);
		if(!optionResult.success) return optionResult;
		const [username, token] = optionResult.data;
		return optionResult;
	}
}

exports.Command = test;
