import * as Loader from "../../scripts/loader.js"
import * as Component from "../../scripts/component.js"

async function _load(fragmentObj){
	if(!fragmentObj.name){
		fragmentObj.name = fragmentObj.path;
		fragmentObj.path = "";
	}

	const fragment = initFragment(fragmentObj.id, fragmentObj.location, fragmentObj.path, fragmentObj.name);

	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = `server/manager/fragments/${fragmentPath}${fragmentName}/${fragmentName}.css`;
	style.id = `Fragment-CSS-${fragmentId}`
	document.head.appendChild(style);

	const htmlLocation = `server/manager/fragments/${fragmentPath}${fragmentName}/${fragmentName}.html`;
	const html = await Loader.loadFile(htmlLocation);
	const elem = $(html);

	return [fragment, style, elem];
}

async function load(fragment, style, elem){
	document.head.appendChild(style);
	$(`#${fragment.location}`).empty();
	$(`#${fragment.location}`).append(elem);
}

async function clear(fragmentObj){
	$(`#Fragment-CSS-${fragmentObj.id}`).remove();
	$(`#${fragmentObj.location}`).empty();
}

async function init(){
	// Stub
} init();
