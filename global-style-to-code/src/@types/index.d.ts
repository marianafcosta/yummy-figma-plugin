import { parseEffectStyle } from "../functions/effect";
import { parsePaintStyle } from "../functions/paint";
import { parseTextStyle } from "../functions/text";

export type ExportMode = "object" | "css" | "scss" | "react-native";

export type Option = "text" | "paint" | "effect";

export type Stylings = {
	text: TextStyling;
	paint: PaintStyling;
	effect: EffectStyling;
};

export type PaintOption = "RGB" | "HSL" | "HEX";

export class Styling {
	code: string;
	downloadableCode: string;
	mode: ExportMode;
	show: boolean;
	constructor();
	getStyle(): void;
	changeMode(mode: ExportMode): void;
	changeShow(): void;
}

export class TextStyling extends Styling {
	style: TextStyle[];
	constructor(style: TextStyle[]);
	getStyle(): void;
}

export class PaintStyling extends Styling {
	style: PaintStyle[];
	paintOption: PaintOption;
	constructor(style: PaintStyle[]);
	getStyle(): void;
	changePaintOption(option: PaintOption): void;
}

export class EffectStyling extends Styling {
	style: EffectStyle[];
	constructor(style: EffectStyle[]);
	getStyle(): void;
}
