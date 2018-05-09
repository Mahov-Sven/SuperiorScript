import * as loader from "./loader.js"

let activeBannerButton = -1;
function setActiveBannerButton(active){

	loader.clearFragment("PageSpace");

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

			break;
		case 1:
			$("#BannerLogin").addClass("Active");
			loader.loadFragment("PageSpace", "login");
			break;
		case 2:
			$("#BannerRegister").addClass("Active");

			break;
	}

	activeBannerButton = active;
}

export function init() {

	$(".Button").click(function(){$(this).toggleClass("Active")});

	// Banner Buttons
	$("#BannerMenu").click(() => setActiveBannerButton(0));
	$("#BannerLogin").click(() => setActiveBannerButton(1));
	$("#BannerRegister").click(() => setActiveBannerButton(2));


}
