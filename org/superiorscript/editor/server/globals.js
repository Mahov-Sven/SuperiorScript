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

/**
 * URL Query Variable Names
 * c
 * 	collection: string; name of the database collection; should be used for development only
 * d
 * 	developer: boolean; whether to  use the developer database or production database
 * o
 * 	op / operation: string; the operation to apply
 * 		file: open / save / close
 * 		account: modify / get
 * p
 * 	password: string; user's password field
 * t
 * 	token: string; the token field; usually the token for a user
 * u
 * 	username: string; user's username field
 */
