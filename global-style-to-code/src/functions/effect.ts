export function parseEffectStyle(arr: EffectStyle[], mode: string) {
	let codeObj = {} as { [key: string]: any };
	let code = JSON.stringify(codeObj, null, 2);
	return Object.keys(codeObj).length
		? `//effect style \n ${code}\n`
		: `//no assigned global effect code\n`;
}
