var exports = module.exports = {};

const filePath = (path) => "../../../" + path;
const Globals = require(filePath("editor/server/globals"));
const Logger = require(filePath("editor/server/logger"));
const Result = require(filePath("editor/server/result")).Result;

class command {

	constructor(){
		this.name = this.constructor.name;;
		this.options = [];
	}

	async execute(query, resource, queue, request){
		// STUB
	}

	_separateOptions(query){
		const optionVals = [];

		for(const optionPair in this.options){
			const option = this.options[optionPair][0];
			const required = this.options[optionPair][1];

			let optionVal = undefined;
			for(const queryName in query){
				if(option.names.has(queryName)){
					if(option.type === Object){
						try{
							optionVal = JSON.parse(query[queryName]);
						} catch(e) {
							return new Result(
								false,
								{
									usage: this.usage(),
									invalidJson: query[queryName],
								},
								`The option ${option.name} was not a valid object`,
								`The Json parsing process for option ${option.name} failed because the format was invalid.`
							)
						}
					}
					else if(option.type === Boolean) optionVal = query[queryName] === "true";
					else optionVal = option.type(query[queryName]);
					break;
				}
			}
			if(optionVal === undefined && required)
				return new Result(
					false,
					{
						usage: this.usage(),
					},
					`The required option ${option.name} was not given`,
					`The option ${option.name} was required but was undefined.`
				);

			optionVals.push(optionVal);
		}

		return new Result(true, optionVals);
	}

	usage(){
		let result = `/${this.name}?`;
		let isFirstArg = true;
		for(const optionPair in this.options){
			const option = this.options[optionPair][0];
			const required = this.options[optionPair][1];

			if(!required) result += `[`;
			if(!isFirstArg) result += `&`;
			if(option.names.size > 1) result += `(`;
			for(const name of option.names){
				result += `${name}||`;
			}
			result = result.substring(0, result.length - 2);
			if(option.names.size > 1) result += `)`;
			result += `=${option.description.short}:${option.type.name}`;
			if(!required) result += `]`;
			isFirstArg = false;
		}
		return result;
	}
}

exports.Command = command;
