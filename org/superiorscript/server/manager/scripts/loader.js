import * as Fragment from "../fragments/fragment.js"

export function init(){
	if(window.fragments)
		throw Error("Property 'fragments' already exists in the window object");
	window.fragments = {};
}

export function loadFile(fileLocation){
	return new Promise((resolve, reject) => {
		$.get(fileLocation, function(file) {
			resolve(file)
		});
	});
}

export async function clearFragment(fragmentId){
	const fragment = initFragment(fragmentId);
	await fragment.ready;
	await fragment.clear();
}

export async function loadFragment(fragmentId, fragmentInsertId, fragmentPath, fragmentName){
	const fragment = initFragment(fragmentId, fragmentInsertId, fragmentPath, fragmentName);
	await fragment.ready;
	await fragment.load();
}

export async function _loadFragment(fragmentId, fragmentInsertId, fragmentPath, fragmentName){

	if(!fragmentName){
		fragmentName = path;
		path = "";
	}

	const fragment = initFragment(fragmentId, fragmentInsertId, fragmentPath, fragmentName);
	if(fragment.ready){
		fragment.main();
		return;
	}

	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = `server/manager/fragments/${fragmentPath}${fragmentName}/${fragmentName}.css`;
	style.id = `Fragment-CSS-${fragmentId}`
	document.head.appendChild(style);

	const htmlLocation = `server/manager/fragments/${fragmentPath}${fragmentName}/${fragmentName}.html`;
	const html = await loadFile(htmlLocation);
	const elem = $(html);
	$(`#${fragmentInsertId}`).empty();
	$(`#${fragmentInsertId}`).append(elem);


	const script = document.createElement("script");
	script.type = "module";
	script.id = `Fragment-JavaScript-${fragmentId}`;
	//script.onload = () => { if(typeof fragmentInit === "function") fragmentInit(); };
	script.src = `server/manager/fragments/${fragmentPath}${fragmentName}/${fragmentName}.js`;

	document.head.appendChild(script);

	await fragment.ready;
	fragment.open();
}

export function initFragment(fragmentId, fragmentInsertId, fragmentPath, fragmentName){
	if(!window.fragments[fragmentId]){
		window.fragments[fragmentId] = {
			load: undefined,
			clear: undefined,
			id: fragmentId,
			location: fragmentInsertId,
			path: fragmentPath,
			name: fragmentName,
			cache : {},
			ready : new Promise((resolve, reject) => {
				const check = () => {
					if(typeof window.fragments[fragmentId].load === "undefined") setTimeout(check, 250);
					else resolve();
				}
				check();
			}),
		};

		const script = document.createElement("script");
		script.type = "module";
		script.id = `Fragment-JavaScript-${fragmentId}`;
		script.onload = () => { $(`#Fragment-JavaScript-${fragmentId}`).remove(); };
		script.src = `server/manager/fragments/${fragmentPath}${fragmentName}/${fragmentName}.js`;
	}

	return window.fragments[fragmentId];
}
