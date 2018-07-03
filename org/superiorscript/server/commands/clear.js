var exports = module.exports = {};

const filePath = (path) => "../../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const Command = require(filePath("editor/server/commands/command")).Command;
const Database = require(filePath("editor/server/database")).Database;

class clear extends Command {

	constructor(){
		super();

		this.options = [
			[global.commandOptions.developer, false],
			[commandOptions.collectionName, false],
		];
	}

	async execute(query){
		Logger.warn("Clear", "Trying to clear a collection(s)");

		const optionResult = this._separateOptions(query);
		if(!optionResult.success) return optionResult;
		const [collectionName, developer] = optionResult.data;
		const databaseName = developer ? databases.developer : databases.production;

		const database = new Database(databaseName, collectionName);
		await database.open();

		let clearResult;
		if(collectionName === undefined) clearResult = await database.clearAll();
		else clearResult = await database.clear();

		if(clearResult.success) Logger.log("Clear", `Collections ${clearResult.data.join(", ")} have been cleared`);

		await database.close();

		return new Result(
			true,
			{},
			`Collections ${clearResult.data.join(", ")} in database ${databaseName} has been cleared`,
			`All entries in database ${databaseName} collections ${clearResult.data.join(", ")} have been removed`
		);
	}
}

exports.Command = clear;
