import * as Loader from "./loader.js"

let activeBannerButton = -1;

export function init() {

	$("#PageTools").hide();

	//$(".Button").click(function(){console.log(this)});

	// Banner Buttons
	$("#BannerMenu").click(() => setActiveBannerButton(0));
	$("#BannerLogin").click(() => setActiveBannerButton(1));
	$("#BannerRegister").click(() => setActiveBannerButton(2));


}

async function setActiveBannerButton(active){

	await Loader.clearFragment("Page", "PageSpace");

	$("#BannerMenu").removeClass("Active");
	$("#BannerLogin").removeClass("Active");
	$("#BannerRegister").removeClass("Active");

	if(active === activeBannerButton){
		activeBannerButton = -1;
		return;
	}

	switch(active){
		case 0:
			$("#BannerMenu").addClass("Active");
			await Loader.loadFragment("BannerMenu", "BannerMenuSpace", "menus/", "banner", true);
			break;
		case 1:
			$("#BannerLogin").addClass("Active");
			await Loader.loadFragment("Page", "PageSpace", "login");
			break;
		case 2:
			$("#BannerRegister").addClass("Active");

			break;
	}

	activeBannerButton = active;
}
