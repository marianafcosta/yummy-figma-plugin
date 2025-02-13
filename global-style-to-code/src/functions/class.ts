import { ExportMode, PaintOption } from "../@types/index";
import { parseEffectStyle } from "./effect";
import { parsePaintStyle, parsePaintStyleForDownload } from "./paint";
import { parseTextStyle, parseTextStylesForDownload } from "./text";

export class Styling {
	code: string;
	downloadableCode: string; // String formated as a valid TSX file
	mode: ExportMode;
	show: boolean;
	constructor() {
		this.code = "";
		this.downloadableCode = "";
		this.mode = "react-native";
		this.show = false;
	}
	getStyle() {}
	changeMode(mode: ExportMode) {
		this.mode = mode;
		this.getStyle();
	}
	changeShow() {
		if (!this.show) {
			this.show = true;
			this.getStyle();
		} else {
			this.show = false;
		}
	}
}

export class TextStyling extends Styling {
	style: TextStyle[];
	constructor(style: TextStyle[]) {
		super();
		this.style = style;
	}
	getStyle() {
		this.code = parseTextStyle(this.style, this.mode);
		this.downloadableCode = parseTextStylesForDownload(this.style)
	}
}

export class PaintStyling extends Styling {
	style: PaintStyle[];
	paintOption: PaintOption;
	constructor(style: PaintStyle[]) {
		super();
		this.style = style;
		this.paintOption = "RGB";
	}
	getStyle() {
		this.code = parsePaintStyle(this.style, this.mode, this.paintOption);
		this.downloadableCode = parsePaintStyleForDownload(this.style, this.paintOption);
	}
	changePaintOption(option: PaintOption) {
		this.paintOption = option;
		this.getStyle();
	}
}

export class EffectStyling extends Styling {
	style: EffectStyle[];
	constructor(style: EffectStyle[]) {
		super();
		this.style = style;
	}
	getStyle() {
		this.code = parseEffectStyle(this.style, this.mode);
	}
}
