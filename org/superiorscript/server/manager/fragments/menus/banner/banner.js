import * as Loader from "../../../scripts/loader.js"
import * as Component from "../../../scripts/component.js"
import * as Fragment from "../../../scripts/fragment.js"

const BannerMenu = Loader.initFragment("BannerMenu", "BannerMenuSpace", "menus/", "banner");

async function load(){
	await BannerMenu.ready;
	const [_, style, __] = await Fragment._load(BannerMenu);
	await Fragment.load(BannerMenu, style, BannerMenu.cache.menu);
	console.log(BannerMenu.cache.menu);

	//Loader.loadMenu("BannerMenuSpace", "BannerMenu", "menus/", "banner", true);
}

async function clear(){
	await Fragment.clear();
}

async function init(){

	const menu = await Component.menu(BannerMenu.id, BannerMenu.path, BannerMenu.name);
	BannerMenu.cache.menu = menu;
	console.log(menu);

	BannerMenu.open = open;
	BannerMenu.close = close;
} init();
