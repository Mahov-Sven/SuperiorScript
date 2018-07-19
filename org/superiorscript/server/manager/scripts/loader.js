import * as Fragment from "../scripts/fragment.js"

export function init(){}

export async function loadFile_(fileLocation){
	return new Promise((resolve, reject) => {
		$.get(fileLocation, function(file) {
			resolve(file)
		});
	});
}

export async function readyFragment(fragmentId, fragmentInsertId, fragmentPath, fragmentName){
	const fragment = Fragment.get(Fragment.obj(fragmentId, fragmentInsertId, fragmentPath, fragmentName));
}

export async function clearFragment_(fragmentId){
	const fragment = Fragment.get(Fragment.obj(fragmentId));
	await fragment.ready;
	await fragment.clear();
}

export async function loadFragment_(fragmentId){
	const fragment = Fragment.get(Fragment.obj(fragmentId));
	await fragment.ready;
	await fragment.load();
}
