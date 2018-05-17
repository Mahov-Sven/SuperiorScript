var exports = module.exports = {};

exports.log = function(title, message, isError=false, isFatal=false){
	let output = "";
	output += isError ? "[ERROR]  " : "[INFO]   ";
	output += title + ": " + strRepeat(" ", loggerTitleSize - 2 - title.length);
	output += message;

	if(isError) console.error(output);
	if(isError && isFatal) throw new Error();
	if(!isError) console.log(output);
}

function strRepeat(str, times){
	let output = "";
	for(let i = 0; i < times; i++){
		output += str;
	}
	return output;
}
