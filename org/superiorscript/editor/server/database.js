var exports = module.exports = {};

const MongoClient = require("mongodb").MongoClient;
const MongoFileSystem = require("mongodb").GridStore;
const Encryption = require("crypto");

const filePath = (path) => "../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;
const PromiseError = require(filePath("editor/server/promise_error")).PromiseError;
const File = require(filePath("editor/server/file")).File;

class Database {

	constructor(databaseName=undefined, collectionName=undefined){
		this.client = undefined;
		this.databaseName = databaseName;
		if(this.databaseName != undefined) Logger.log("Database", `Switched to database ${this.databaseName}`);
		this.database = undefined;
		this.collectionName = collectionName;
		if(this.collectionName != undefined) Logger.log("Database", `Switched to collection ${this.collectionName}`);
	}

	async _open(){
		return new Promise((resolve, reject) => {
			MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (error, client) => {
				if (error){
					reject(new PromiseError(error));
				} else {
					this.client = client;
					if(this.databaseName) this.database = this.client.db(this.databaseName);
					resolve(new Result(true));
				}
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.err("Database", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async open(){
		Logger.log("Database", "Trying to connected to client...");
		const result = await this._open();
		if(result.success) Logger.log("Database", "Successfully connected to client");
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

	async _collections(){
		return new Promise((resolve, reject) => {
			this.database.listCollections().toArray((error, collectionInfos) => {
				if (error){
					reject(new PromiseError(error));
				} else {
					resolve(new Result(true, collectionInfos));
				}
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.err("Database", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async collectionNames(){
		const collectionResults = await this._collections();
		if(!collectionResults.success) return new Result(false);
		const collectionNames = [];
		for(const collectionInfo of collectionResults.data){
			collectionNames.push(collectionInfo.name);
		}
		return new Result(true, collectionNames);
	}

	async addToken(object){
		const prevCollection = this.collectionName;
		await this.switchToCollection(collections.tokens);

		const tokenObj = {};
		tokenObj.object = object;

		const tokenResult = await this.find(object);
		if(tokenResult.success) {
			await this.switchToCollection(prevCollection);
			return tokenResult;
		}

		tokenObj.token = Encryption
			.createHash("sha1")
			.update((new Date()).toString() + Math.random().toString())
			.digest("hex");

		tokenObj.date = new Date();

		await this.add(tokenObj);
		await this.switchToCollection(prevCollection);

		return new Result(true, tokenObj);
	}

	async findToken(token){
		const prevCollection = this.collectionName;
		await this.switchToCollection(collections.tokens);

		const tokenObj = {};
		tokenObj.token = token;

		const tokenResult = await this.find(tokenObj);
		if(tokenResult.success){
			const timeDiff = (new Date()).getTime() - tokenResult.data.date.getTime();

			if(timeDiff >= tokenLifetime)
				await this.remove(tokenObj);

			await this.switchToCollection(prevCollection);
			return new Result(timeDiff < tokenLifetime, tokenResult.data);
		}

		await this.switchToCollection(prevCollection);

		return new Result(false);
	}

	async _add(objArr){
		if(this.collectionName === undefined) throw new Error("Invalid collection name undefined");
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).insertMany(objArr, (error, res) => {
				if (error){
					reject(new PromiseError(error));
				} else {
					resolve(new Result(true, res));
				}
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.warn("Database", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async add(input){
		const objArr = Array.isArray(input) ? input : [input];
		Logger.log("Database", `Trying to add ${objArr.length} object(s) into collection ${this.collectionName}...`);
		const result = await this._add(objArr);
		if(result.success) Logger.log("Database", `Successfully added ${objArr.length} object(s) into collection ${this.collectionName}`);
		return result;
	}

	async update(){
		// TODO
	}

	async _remove(query){
		if(this.collectionName === undefined) throw new Error("Invalid collection name undefined");
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).deleteMany(query, (error, res) => {
				if (error){
					reject(new PromiseError(error));
				} else {
					resolve(new Result(true));
				}
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.warn("Database", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async remove(query){
		if(query === undefined) return new Result(false);
		Logger.log("Database", `Trying to remove an object(s) from collection ${this.collectionName}...`);
		const result = await this._remove(query);
		if(result.success) Logger.log("Database", `Successfully removed an object(s) from collection ${this.collectionName}`);
		return result;
	}

	async _query(query){
		if(query === undefined) query = {};
		if(this.collectionName === undefined) throw new Error("Invalid collection name undefined");
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).find(query).toArray((error, res) => {
				if (error){
					reject(new PromiseError(error));
				} else {
					resolve(new Result(res.length > 0, res));
				}
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.warn("Database", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async query(query){
		Logger.log("Database", `Trying to find an object(s) in collection ${this.collectionName}...`);
		const result = await this._query(query);
		if(result.success) Logger.log("Database", `Successfully found the object(s) in collection ${this.collectionName}`);
		else Logger.log("Database", `Could not find the object(s) in collection ${this.collectionName}`);
		return result;
	}

	async find(query){
		Logger.log("Database", `Trying to find an object in collection ${this.collectionName}...`);
		const result = await this._query(query);
		if(result.data.length != 1){
			Logger.warn("Database", `Query returned more than one object in collection ${this.collectionName}`)
			result.success = false
		}
		if(result.success){
			Logger.log("Database", `Successfully found the object in collection ${this.collectionName}`);
			result.data = result.data[0];
		}
		else Logger.log("Database", `Could not find the object in collection ${this.collectionName}`);
		return result;
	}

	async _clear(){
		return new Promise((resolve, reject) => {
			this.database.collection(this.collectionName).drop((error, res) => {
				if (error){
					reject(new PromiseError(error));
				} else {
					resolve(new Result(true));
				}
			});
		}).catch((e) => {
			if(e.fromPromise){
				Logger.warn("Database", e.error);
				return new Result(false);
			}
			else throw e;
		});
	}

	async clear(){
		Logger.warn("Database", `Trying to clear collection ${this.collectionName} in database ${this.databaseName}...`);
		const result = await this._clear();
		if(result.success) Logger.warn("Database", `Successfully cleared collection ${this.collectionName} in database ${this.databaseName}`);
		return new Result(result.success, [this.collectionName]);
	}

	async file(fileName){
		return new File(fileName, this);
	}

	async clearAll(){
		Logger.warn("Database", `Trying to clear database ${this.databaseName}...`);
		const prevCollection = this.collectionName;
		const collectionNameResults = await this.collectionNames();
		let success = collectionNameResults.success;
		const clearedCollections = [];
		if(success){
			for(const collection of collectionNameResults.data){
				await this.switchToCollection(collection);
				const result = await this._clear();
				if(result.success){
					clearedCollections.push(collection);
					Logger.warn("Database", `Successfully cleared collection ${this.collectionName} in database ${this.databaseName}`);
				}
				else success = false;
			}
		}
		await this.switchToCollection(prevCollection);
		if(success) Logger.warn("Database", `Successfully cleared database ${this.databaseName}`);
		return new Result(success, clearedCollections);
	}

	async close(){
		Logger.log("Database", `Trying to disconnect from client...`);
		this.client.close();
		Logger.log("Database", `Successfully disconnected from client`);
	}
}

exports.Database = Database;
