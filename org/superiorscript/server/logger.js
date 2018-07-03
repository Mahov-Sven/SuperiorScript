var exports = module.exports = {};

exports.log = function(header, message){
	console.log(constructMessage("INFO", header, message));
}

exports.warn = function(header, message){
	console.warn(constructMessage("WARNING", header, message));
}

exports.err = function(header, error){
	console.error(constructMessage("ERROR", header, error.stack));
}

function constructMessage(title, header, message){
	return "[" + title +"] "  + strRepeat(" ", loggerTitleSize - 3 - title.length)
		+ header + ": " + strRepeat(" ", loggerHeadingSize - 2 - header.length)
		+ message;
}

function strRepeat(str, times){
	let output = "";
	for(let i = 0; i < times; i++){
		output += str;
	}
	return output;
}
