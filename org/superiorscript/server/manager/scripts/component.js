import * as Loader from "./loader.js"

export async function menu_(fragmentId, optionsPath, optionsFile){

	const root = $(`<div>`);
	root.addClass("Menu-OptionSubMenuContainer");

	const rootMenu = $(`<div>`);
	rootMenu.addClass("Menu-OptionMenu");
	root.append(rootMenu);

	let file = await Loader.loadFile_(`server/manager/fragments/${optionsPath}${optionsFile}/${optionsFile}.options`);
	file = file.replace(/[\s]+/g, '');
	const menuOptionArray = file.split(';');
	menuOptionArray.pop();
	for(const menuOption of menuOptionArray){
		const optionRegexArray = /^(([\w]+.?)+)(:((([\w]+\/)*)([\w]+))->([\w]+))?$/.exec(menuOption);
		const optionPath = optionRegexArray[1];
		const optionPathArray = optionPath.split('.');
		const clickFragmentId = optionPathArray.join("");
		const clickFragmenPath = optionRegexArray[5];
		const clickFragmentName = optionRegexArray[7];
		const clickFragmentLocation = optionRegexArray[8];
		if(!clickFragmentId || !clickFragmenPath ||
			!clickFragmentName || !clickFragmentLocation) continue;

		await Loader.readyFragment(clickFragmentId, clickFragmentLocation, clickFragmenPath, clickFragmentName);

		let elem = rootMenu;
		for(const optionSelectionIndex in optionPathArray){
			const optionSelectionName = optionPathArray[optionSelectionIndex];
			const optionSelectionId = optionPathArray.slice(0, Number(optionSelectionIndex) + 1).join('-');
			const fullOptionId = `${fragmentId}-MenuOption-${optionSelectionId}`;

			const findResult = elem.find(`#${fullOptionId}`);
			if(findResult.length === 0){
				const optionElement = $("<div>");
				optionElement.addClass("FlexRow");
				optionElement.addClass("Menu-OptionRow");

				const optionNameElement = $("<div>");
				optionNameElement.text(optionSelectionName);
				optionNameElement.addClass("FlexStatic");
				optionNameElement.addClass("ButtonText");
				optionNameElement.addClass("Menu-OptionName");
				optionElement.append(optionNameElement);

				const optionFillElement = $("<div>");
				optionFillElement.addClass("FlexDynamic");
				optionElement.append(optionFillElement);

				const optionSubMenuContainer = $("<div>");
				optionSubMenuContainer.addClass("Menu-OptionSubMenuContainer");
				optionElement.append(optionSubMenuContainer);

				const optionNextMenu = $("<div>");
				optionNextMenu.attr("id", fullOptionId);
				optionNextMenu.addClass("FlexColumn");
				optionNextMenu.addClass("Menu-OptionMenu");
				optionSubMenuContainer.append(optionNextMenu);

				optionElement.click(() => {
					console.log(root.find(".Active"));
					root.find(".Active").removeClass(".Active");
					optionNameElement.addClass("Active");
				});
				if(optionSelectionIndex == optionPathArray.length - 1)
					optionElement.click(() => console.log("Hi"));//Loader.loadFragment_(clickFragmentId));

				elem.append(optionElement);
				elem = optionNextMenu;
			}
			else elem = $(findResult[0]);
		}
	}

	return root;
}
