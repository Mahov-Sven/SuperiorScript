import * as Loader from "./loader.js"

export async function menu(fragmentId, optionsPath, optionsFile){
	const root = $(`<div>`);

	let file = await Loader.loadFile(`server/manager/fragments/${optionsPath}${optionsFile}/${optionsFile}.options`);
	file = file.replace(/[\s]+/g, '');
	const menuOptionArray = file.split(';');
	menuOptionArray.pop();
	for(const menuOption of menuOptionArray){
		const optionRegexArray = /^(([\w]+.?)+)(:((([\w]+\/)*)([\w]+))->([\w]+))?$/.exec(menuOption);
		const optionPath = optionRegexArray[1];
		const optionPathArray = optionPath.split('.');
		const filePath = optionRegexArray[5];
		const fileName = optionRegexArray[7];
		const clickFragmentInsertId = optionRegexArray[8];
		if(!filePath || !fileName || !clickFragmentInsertId) continue;

		let elem = root;
		for(const optionSelectionIndex in optionPathArray){
			const optionSelection = optionPathArray[optionSelectionIndex];
			const findResult = elem.children(`#${fragmentId}-optionSelection`);
			if(findResult.length === 0){
				const optionElement = $("<div>");
				optionElement.id = `#${fragmentId}-optionSelection`;
				optionElement.text(optionSelection);
				//optionElement.addClass();
				elem.append(optionElement);
				elem = optionElement;
			}
			else elem = findResult[0];
			if(optionSelectionIndex == optionPathArray.length - 1){
				elem.click(() => Loader.loadFragment(clickFragmentInsertId, fragmentId, filePath, fileName));
			}
		}
	}

	const result = root.children();
	root.remove();
	return result;
}
