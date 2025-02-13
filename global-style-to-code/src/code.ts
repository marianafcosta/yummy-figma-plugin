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
	}, `import { StyleSheet } from 'react-native';\n\n`);
}

if (figma.editorType === "figma") {
	figma.showUI(__uiFiles__.main, { width: 440, height: 447 });

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
				figma.ui.postMessage({type: "update-code", code: getCodeFromStylings(stylings), downloadableCode: getDownloadableCodeFromStylings(stylings) });
				break;
			case "mode":
				const change = msg.change;
				stylings["text"].changeMode(change);
				stylings["paint"].changeMode(change);
				stylings["effect"].changeMode(change);
				figma.ui.postMessage({type: "update-code", code: getCodeFromStylings(stylings), downloadableCode: getDownloadableCodeFromStylings(stylings) });
				break;
			case "paint-option":
				const option = msg.id as PaintOption;
				stylings["paint"].changePaintOption(option);
				figma.ui.postMessage({type: "update-code", code: getCodeFromStylings(stylings), downloadableCode: getDownloadableCodeFromStylings(stylings) });
				break;
			case "create-merge-request-request":
				figma.ui.postMessage({type: "create-merge-request-response", data: getDownloadableCodeFromStylings(stylings)})
				break;
			case "cancel":
				figma.closePlugin();
				break;
			case "notify": 
				figma.notify(msg.data, {
					error: msg.error
				});
				break;
			default:
				console.log("Received message: ", typeof msg, msg)
		}
	};
}
