import { MenuItem } from "./menu-item";

export class StringUtils {
	static formatMenuEntryText(item: MenuItem): string {
		let name = MenuItem[item].toLowerCase();
		return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	}
}
