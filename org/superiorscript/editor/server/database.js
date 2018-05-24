var exports = module.exports = {};

const MongoClient = require("mongodb").MongoClient;

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));

class Database {

	constructor(databaseName=undefined, collectionName=undefined){
		this.client = undefined;
		this.databaseName = databaseName;
		if(this.databaseName != undefined) Logger.log("Database", `Switched to database ${this.databaseName}`);
		this.database = undefined;
		this.collectionName = undefined;
		if(this.collectionName != undefined) Logger.log("Database", `Switched to collection ${this.collectionName}`);
	}

	async open(){
		Logger.log("Database", "Trying to connected to client...");
		return new Promise((resolve, reject) => {
			MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
				if (err){
					reject(err);
				} else {
					Logger.log("Database", "Successfully connected to cleint");

					this.client = client;
					if(this.databaseName) this.database = this.client.db(this.databaseName);
					resolve(this);
				}
			});
		}).catch((e) => {
			Logger.err("Database", e);
		});
	}

	async switchToDatabase(databaseName){
		this.databaseName = databaseName;
		Logger.log("Database", `Switched to database ${this.databaseName}`);
		this.database = this.client.db(this.databaseName);
	}

	async switchToCollection(collectionName){
		this.collectionName = collectionName;
		Logger.log("Database", `Switched to collection ${this.collectionName}`);
	}

	async _add(objArr){
		if(this.collectionName === undefined) throw new Error("Invalid collection name undefined");
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).insertMany(objArr, function(err, res){
				if (err){
					reject({error: err, isLocal:true});
				} else {
					resolve(true);
				}
			});
		}).catch((e) => {
			if(e.isLocal){
				Logger.warn("Database", e.error);
				return false;
			}
			else throw e;
		});
	}

	async add(input){
		const objArr = Array.isArray(input) ? input : [input];
		Logger.log("Database", `Trying to add ${objArr.length} object(s) into collection ${this.collectionName}...`);
		if(await this._add(objArr)) Logger.log("Database", `Successfully added ${objArr.length} object(s) into collection ${this.collectionName}`);
	}

	async update(){
		// TODO
	}

	async _remove(query){
		if(this.collectionName === undefined) throw new Error("Invalid collection name undefined");
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).deleteMany(query, function(err, res){
				if (err){
					reject({error: err, isLocal:true});
				} else {
					resolve(true);
				}
			});
		}).catch((e) => {
			if(e.isLocal){
				Logger.warn("Database", e.error);
				return false;
			}
			else throw e;
		});
	}

	async remove(query){
		if(query === undefined) query = {};
		Logger.log("Database", `Trying to remove ${objArr.length} object(s) from collection ${this.collectionName}...`);
		if(await this._remove(query)) Logger.log("Database", `Successfully removed ${objArr.length} object(s) from collection ${this.collectionName}`);
	}

	async _find(query){
		if(this.collectionName === undefined) throw new Error("Invalid collection name undefined");
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).find(query).toArray(function(err, res){
				if (err){
					reject({error: err, isLocal:true});
				} else {
					resolve(res);
				}
			});
		}).catch((e) => {
			if(e.isLocal){
				Logger.warn("Database", e.error);
				return false;
			}
			else throw e;
		});
	}

	async find(query){
		if(query === undefined) query = {};
		Logger.log("Database", `Trying to find an object in collection ${this.collectionName}...`);
		const result = await this._find(query);
		if(result.length > 0) Logger.log("Database", `Successfully found the object in collection ${this.collectionName}`);
		else Logger.log("Database", `Could not find the object in collection ${this.collectionName}`);
		return result;
	}

	async _clear(){
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).drop(function(err, res){
				if (err){
					reject({error: err, isLocal:true});
				} else {
					resolve(true);
				}
			});
		}).catch((e) => {
			if(e.isLocal){
				Logger.warn("Database", e.error);
				return false;
			}
			else throw e;
		});
	}

	async clear(){
		Logger.warn("Database", `Trying to clear collection ${this.collectionName} in database ${this.databaseName}...`);
		if(this._clear()) Logger.warn("Database", `Successfully cleared collection ${this.collectionName} in database ${this.databaseName}`);
	}

	async close(){
		Logger.log("Database", `Trying to disconnect from client...`);
		this.client.close();
		Logger.log("Database", `Successfully disconnected from client`);
	}
}

exports.Database = Database;
