var exports = module.exports = {};

const filePath = (path) => "../../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const Command = require(filePath("editor/server/commands/command")).Command;
const Database = require(filePath("editor/server/database")).Database;

class login extends Command {

	constructor(){
		super();

		this.options = [
			[global.commandOptions.developer, false],
			[global.commandOptions.username, false],
			[global.commandOptions.password, false],
			[global.commandOptions.token, false],
		];
	}

	async execute(query){
		const optionResult = this._separateOptions(query);
		if(!optionResult.success) return optionResult;
		const [username, password, token, developer] = optionResult.data;
		const databaseName = developer ? databases.developer : databases.production;

		const database = new Database(databaseName);
		await database.open();
		await database.switchToCollection(collections.users);

		/* Try to match token */
		if(token != undefined){
			Logger.log("Login", "Trying to match given token with user");
			const resultToken = await database.findToken(token);
			if(resultToken.success){
				Logger.log("Login", `Login token matched in the database ${databaseName}`);
				const userResult = await database.find({ _id: resultToken.data.itemId });
				Logger.log("Login", `Retrieved user information`);

				await database.close();

				return new Result(
					true,
					{
						token: resultToken.data.token,
						user: {
							username: userResult.data.username,
						},
					},
					"Login successful",
					`Login token matched in the database ${databaseName}`
				);
			}
		}
		else Logger.log("Login", "No token given");

		if(username && username.toLowerCase() === "guest"){
			Logger.log("Login", "User logging in with guest account");
			const user = {};
			user.username = "Guest";
			user.password = "";

			const guestFindResult = await database.find(user);
			if(!guestFindResult.success){
				await database.add(user);
			}

			Logger.log("Login", "Retrieving/Updating guest account token");
			const resultToken = await database.addToken(user);
			await database.close();
			Logger.log("Login", "User has logged in to guest");

			return new Result(
				true,
				{
					token: resultToken.data.token,
					user: {
						username: user.username,
					},
				},
				"Guest login successful",
				"Username used matched to guest username"
			);
		} else {
			Logger.log("Login", "User logging in with non-guest account");

			Logger.log("Login", "Testing to ensure username and password were provided");
			if(username === undefined || password === undefined){
				await database.close();
				Logger.log("Login", `Either username or password was undefined`);

				return new Result(
					false,
					{},
					"Username or password missing",
					"Either username or password was undefined"
				);
			}

			const user = {};
			user.username = username;
			user.password = password;

			Logger.log("Login", `Searching for user account in database ${databaseName}`);
			const resultUser = await database.find(user);

			if(!resultUser.success){
				await database.close();
				Logger.log("Login", "User account not found for given username and password");

				return new Result(
					false,
					{},
					"The username or password are incorrect",
					`The specific combination of the given username and password could not be found in the database ${databaseName}`
				);
			}
			else Logger.log("Login", "User account found");

			Logger.log("Login", "Retrieving/Updating user account token");
			const resultToken = await database.addToken(user);
			await database.close();
			Logger.log("Login", "User logged in successfully");

			return new Result(
				true,
				{
					token: resultToken.data.token,
					user: {
						username: user.username,
					},
				},
				"Login successful",
				`User found in the database ${databaseName}`
			);
		}
	}
}

exports.Command = login;
