/* GLOBAL VARIABLES */
global.mongoUrl = "mongodb://localhost:27017/";
global.databases = {
	developer: "developer",
	production: "production",
};
global.collections = {
	users: "users",
	tokens: "tokens",
}
global.tokenLifetime = 1000 /* base milliseconds */
	*	60 /* seconds */
	* 	60 /* minutes */
	* 	24 /* hours */
	* 	30 /* days */;
// TODO
global.sessionLifetime = 1000 /* base milliseconds */
	*	60 /* seconds */
	* 	60 /* minutes */
	* 	1 /* hours */
	* 	1 /* days */;
global.loggerTitleSize = 10;
global.loggerHeadingSize = 10;
global.commandOptions = {
	collectionName : {
		name: "collectionName",
		type: String,
		names: new Set(["c", "cn", "collection", "collectionName"]),
		description: {
			short: "collection_to_clear",
			long: "The collection to be cleared.",
		},
	},
	developer : {
		name: "developer",
		type: Boolean,
		names: new Set(["d", "developer"]),
		description: {
			short: "use_developer_database",
			long: "Whether to use the developer database over the production one.",
		},
	},
	displayName : {
		name: "displayName",
		type: String,
		names: new Set(["d", "dn", "name", "display", "displayName"]),
		description: {
			short: "display_name",
			long: "The name that should be displayed to all users.",
		},
	},
	email : {
		name: "email",
		type: String,
		names: new Set(["e", "em", "email"]),
		description: {
			short: "email",
			long: "The (primary) email field for the user.",
		},
	},
	password : {
		name: "password",
		type: String,
		names: new Set(["p", "password"]),
		description: {
			short: "password",
			long: "The password field for the user.",
		},
	},
	token : {
		name: "token",
		type: String,
		names: new Set(["t", "token"]),
		description: {
			short: "username_token",
			long: "The temporary token given for the user.",
		},
	},
	username : {
		name: "username",
		type: String,
		names: new Set(["u", "username"]),
		description: {
			short: "username",
			long: "The username field for the user.",
		},
	},
}
