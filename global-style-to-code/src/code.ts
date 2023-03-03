import { Option, PaintOption, Stylings } from "./@types/index";
import { TextStyling, EffectStyling, PaintStyling } from "./functions/class";

function getCodeFromStylings(stylings: Stylings) {
	return Object.keys(stylings).reduce((acc, cur) => {
		const styling = stylings[cur as Option];
		if (styling.show) {
			acc += `${styling.code}`;
		}
		return acc;
	}, ``);
}

function getDownloadableCodeFromStylings(stylings: Stylings) {
	return Object.keys(stylings).reduce((acc, cur) => {
		const styling = stylings[cur as Option];
		if (styling.show) {
			acc += `${styling.downloadableCode}`;
		}
		return acc;
	}, `import { StyleSheet } from 'react-native';\n`);
}

if (figma.editorType === "figma") {
	figma.showUI(__uiFiles__.main, { width: 600, height: 720 });

	const stylings: Stylings = {
		text: new TextStyling(figma.getLocalTextStyles()),
		paint: new PaintStyling(figma.getLocalPaintStyles()),
		effect: new EffectStyling(figma.getLocalEffectStyles()),
	};

	figma.ui.onmessage = (msg: any) => {
		switch (msg.type) {
			case "style":
				const styleId = msg.id as Option;
				stylings[styleId].changeShow();
				figma.ui.postMessage({code: getCodeFromStylings(stylings), downloadableCode: getDownloadableCodeFromStylings(stylings) });
				break;
			case "mode":
				const modeId = msg.id as Option;
				const change = msg.change;
				stylings[modeId].changeMode(change);
				figma.ui.postMessage({code: getCodeFromStylings(stylings), downloadableCode: getDownloadableCodeFromStylings(stylings) });
				break;
			case "paint-option":
				const option = msg.id as PaintOption;
				stylings["paint"].changePaintOption(option);
				figma.ui.postMessage({code: getCodeFromStylings(stylings), downloadableCode: getDownloadableCodeFromStylings(stylings) });
				break;
			case "create-merge-request-request":
				figma.ui.postMessage({type: "create-merge-request-response", data: getDownloadableCodeFromStylings(stylings)})
				break;
			case "cancel":
				figma.closePlugin();
				break;
			default:
				console.log("Received message: ", typeof msg, msg)
		}
	};
}
