import * as Loader from "../scripts/loader.js"
import * as Component from "../scripts/component.js"

// ---===   INIT   ===---

if(window.fragments)
	throw Error("Property 'fragments' already exists in the window object");
window.fragments = {};

// ---===   END INIT   ===---

export async function _load_(fragmentObj){
	if(!fragmentObj.name){
		fragmentObj.name = fragmentObj.path;
		fragmentObj.path = "";
	}

	const fragment = get(fragmentObj);

	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = `server/manager/fragments/${fragmentObj.path}${fragmentObj.name}/${fragmentObj.name}.css`;
	style.id = `${fragmentObj.id}-CSS`
	document.head.appendChild(style);

	const htmlLocation = `server/manager/fragments/${fragmentObj.path}${fragmentObj.name}/${fragmentObj.name}.html`;
	const html = await Loader.loadFile_(htmlLocation);
	const elem = $(html);

	return [fragment, style, elem];
}

export function load(fragmentObj, style, elem){
	document.head.appendChild(style);
	$(`#${fragmentObj.location}`).empty();
	$(`#${fragmentObj.location}`).append(elem);
}

export function clear(fragmentObj){
	$(`#${fragmentObj.id}-CSS`).remove();
	$(`#${fragmentObj.location}`).empty();
}

export function exists(fragmentObj){
	return window.fragments[fragmentObj.id] !== undefined;
}

export function init(fragmentObj){
	if(!fragmentObj.name){
		fragmentObj.name = fragmentObj.path;
		fragmentObj.path = "";
	}

	window.fragments[fragmentObj.id] = {
		load: undefined,
		clear: undefined,
		id: fragmentObj.id,
		location: fragmentObj.location,
		path: fragmentObj.path,
		name: fragmentObj.name,
		cache : {},
		ready : undefined,
	};

	window.fragments[fragmentObj.id].ready = new Promise((resolve, reject) => {
		const check = () => {
			if(typeof window.fragments[fragmentObj.id].load === "undefined") setTimeout(check, 250);
			else resolve();
		}
		check();
	});

	const script = document.createElement("script");
	script.type = "module";
	script.id = `${fragmentObj.id}-JavaScript`;
	//script.onload = () => { $(`#Fragment-JavaScript-${fragmentObj.id}`).remove(); };
	script.src = `server/manager/fragments/${fragmentObj.path}${fragmentObj.name}/${fragmentObj.name}.js`;
	document.head.appendChild(script);

	return window.fragments[fragmentObj.id];
}

export function get(fragmentObj){
	if(!exists(fragmentObj)) init(fragmentObj);
	return window.fragments[fragmentObj.id];
}

export function obj(fragmentId, fragmentLocation, fragmentPath, fragmentName){
	return {
		id: fragmentId,
		location: fragmentLocation,
		path: fragmentPath,
		name: fragmentName,
	}
}
