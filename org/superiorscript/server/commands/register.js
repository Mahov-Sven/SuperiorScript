var exports = module.exports = {};

const filePath = (path) => "../../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const Command = require(filePath("editor/server/commands/command")).Command;
const Database = require(filePath("editor/server/database")).Database;

class register extends Command {

	constructor(){
		super();

		this.options = [
			[commandOptions.developer, false],
			[commandOptions.displayName, false],
			[commandOptions.username, true],
			[commandOptions.password, true],
			[commandOptions.email, false],
		];
	}

	async execute(query){
		Logger.log("Register", "User registration requested");

		const optionResult = this._separateOptions(query);
		if(!optionResult.success) return optionResult;
		const [username, password, developer] = optionResult.data;
		const databaseName = developer ? databases.developer : databases.production;

		const database = new Database(databaseName);
		await database.open();
		await database.switchToCollection(collections.users);

		const user = {};

		/* Test username */
		Logger.log("Register", "Testing given username");
		user.username = username;

		if(username === undefined){
			await database.close();
			Logger.log("Register", `User's username was missing`);

			const response = new Result(
				false,
				{},
				"Your account is missing a username",
				"Undefined username given"
			);
		}

		//await database.clear();

		// TODO ensure username meets some standard

		const resultUser = await database.find(user);
		if(resultUser.success){
			await database.close();
			Logger.log("Register", `User already exists in database ${databaseName}`);

			return new Result(
				false,
				{},
				"That username has already been taken",
				`At least 1 user matches given username in the database ${databaseName}`
			);
		}

		Logger.log("Register", "Given username passed tests");

		/* Test password */
		Logger.log("Register", "Testing given password");
		user.password = password;

		// TODO ensure password meets some standard

		Logger.log("Register", "Given password passed tests");

		/* Add user */
		Logger.log("Register", `Adding user to database ${databaseName}`);
		await database.add(user);

		/* Create token */
		Logger.log("Register", `Creating token for user`);
		const resultToken = await database.addToken(user);
		await database.close();

		Logger.log("Register", "User has been registered");

		return new Result(
			true,
			{
				token: resultToken.data.token,
				user: {
					username: user.username,
				}
			},
			"Your account has been successfully registered",
			`login token created for given username in the database ${databaseName}`
		);
	}
}

exports.Command = register;
