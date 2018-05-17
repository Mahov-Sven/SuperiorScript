var exports = module.exports = {};

const MongoClient = require("mongodb").MongoClient;

class Database {

	constructor(dbName=undefined){
		this.dbName = dbName;
		this.db = undefined;
		this.dbo = undefined;
	}

	async connect(){
		return new Promise(function(resolve, reject) {
			MongoClient.connect(mongoURL, function(err, db){
				if (err){
					reject(err);
				} else {
					this.db = db;
					this.dbo = db.db(this.dbName);
					resolve(this);
				}
			});
		});
	}

	switchTo(dbName){
		this.dbName = dbName;
		this.dbo = db.db(this.dbName);
	}

	async checkToken(request, resource, queue){

	}

	async _insert(obj){
		return new Promise(function(resolve, reject) {
			dbo.insertOne(obj, function(err, res){
				if (err){
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
	}

	async insert(...objs){
		for(const obj of objs){
			await this._insert(obj);
		}
	}

	close(){
		db.close();
	}
}

module.exports.Database = Database;
