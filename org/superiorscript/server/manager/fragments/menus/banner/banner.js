import * as Loader from "../../../scripts/loader.js"
import * as Component from "../../../scripts/component.js"
import * as Fragment from "../../../scripts/fragment.js"

const BannerMenu = Fragment.get(Fragment.obj("BannerMenu", "BannerMenuSpace", "menus/", "banner"));

async function load_(){
	await BannerMenu.ready;
	const [_, style, __] = await Fragment._load_(BannerMenu);
	Fragment.load(BannerMenu, style, BannerMenu.cache.menu);

	//Loader.loadMenu("BannerMenuSpace", "BannerMenu", "menus/", "banner", true);
}

async function clear_(){

	// TODO fix events being destroyed on clear
	Fragment.clear(BannerMenu);
}

async function init_(){

	const menu = await Component.menu_(BannerMenu.id, BannerMenu.path, BannerMenu.name);
	BannerMenu.cache.menu = menu;

	BannerMenu.load = load_;
	BannerMenu.clear = clear_;
} init_();
