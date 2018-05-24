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
global.loggerTitleSize = 10;
global.loggerHeadingSize = 10;
