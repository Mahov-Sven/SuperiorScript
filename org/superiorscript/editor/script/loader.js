export function loadFile(fileLocation){
	return new Promise((resolve, reject) => {
		$.get(fileLocation, function(file) {
			resolve(file)
		});
	});
}

export function loadFragment(insertId, fragmentName){
	const script = document.createElement("script");
	script.onload = () => {
		if(typeof fragmentInit === "function")
			fragmentInit();
	}
	script.src = `editor/fragments/${fragmentName}/${fragmentName}.js`;
	script.id = `Fragment-${fragmentName}-JavaScript`
	document.head.appendChild(script);

	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = `editor/fragments/${fragmentName}/${fragmentName}.css`;
	style.id = `Fragment-${fragmentName}-JavaScript`
	document.head.appendChild(style);

	const htmlLocation = `editor/fragments/${fragmentName}/${fragmentName}.html`;
	loadFile(htmlLocation).then((html) => {
		$(document.getElementById(insertId)).append(html);
	});
}
