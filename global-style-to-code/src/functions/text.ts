import { checkDuplicatedName, convertKebabToPascal, getDepthName, replaceToStyleCode } from './utils';
const textStyleMapper = {
  textDecoration: {
    ['UNDERLLINE']: 'underline',
    ['STRIKETHROUGH']: 'line-through',
  },
  fontStyle: {
    ['Thin']: 100,
    ['ExtraLight']: 200,
    ['Light']: 300,
    ['Regular']: 400,
    ['Medium']: 500,
    ['SemiBold']: 600,
    ['Bold']: 700,
    ['ExtraBold']: 800,
    ['Black']: 900,
  },
  textCase: {
    ['UPPER']: 'uppercase',
    ['LOWER']: 'lowercase',
    ['TITLE']: 'capitalize',
  },
};

function processTextStyle(textStyle: TextStyle) {
  let style: { [key: string]: any } = {};
  style.fontSize = `${textStyle.fontSize}px`;
  if (textStyle.textDecoration !== 'NONE')
    style.textDecoration =
      textStyleMapper['textDecoration'][textStyle.textDecoration];
  style.fontFamily = textStyle.fontName.family;
  textStyle.fontName.style.split(' ').forEach((st: string) => {
    if (st === 'Italic') {
      style.fontStyle = 'italic';
    } else {
      const mappedWeight = textStyleMapper['fontStyle'][st];
      if (mappedWeight) style.fontWeight = mappedWeight;
    }
  });
  style.letterSpacing =
    textStyle.letterSpacing.unit === 'PIXELS'
      ? `${textStyle.letterSpacing.value}px`
      : `${textStyle.letterSpacing.value / 100}em`;

  if (textStyle.lineHeight.unit !== 'AUTO') {
    style.lineHeight =
      textStyle.letterSpacing.unit === 'PIXELS'
        ? `${textStyle.letterSpacing.value}px`
        : `${textStyle.letterSpacing.value}px`;
  }

  if (textStyle.paragraphIndent != 0)
    style.textIndent = `${textStyle.paragraphIndent}px`;
  if (textStyle.textCase !== 'ORIGINAL')
    style.textTransform = textStyleMapper['textCase'][textStyle.textCase];

  return style
}

// parse
export function parseTextStyle(arr: TextStyle[], mode: string) {
  let code = '';
  let codeObj = {} as { [key: string]: any };
  let dupCnt = {} as { [key: string]: number };

  arr.forEach((textStyle) => {
    let style: { [key: string]: any } = processTextStyle(textStyle);
    const originKey = getDepthName(textStyle.name);
    const key = checkDuplicatedName(originKey, codeObj, dupCnt);
    codeObj[key] = style;
  });

  if (mode === 'css') {
    code = Object.keys(codeObj).reduce((acc, key) => {
      acc += `.${key} ${replaceToStyleCode(
        JSON.stringify(codeObj[key], null, 2)
      )}\n`;
      return acc;
    }, ``);
  } else if (mode === 'scss') {
    code = Object.keys(codeObj).reduce((acc, key) => {
      acc += `@mixin ${key} ${replaceToStyleCode(
        JSON.stringify(codeObj[key], null, 2)
      )}\n`;
      return acc;
    }, ``);
  } else if (mode === 'react-native') {
    code = parseTextStylesForDownload(arr)
  } else {
    code = JSON.stringify(codeObj, null, 2);
  }

  return arr.length
    ? `// Typography\n${code}\n`
    : `// no assigned global text code\n`;
}

function parseTextStylesForReactNative(style: { [key: string]: any }) {
  return {
    // TODO: Can't use spread operator
    // ...style,
    fontFamily: style.fontFamily,
    fontSize: parseInt(style.fontSize.slice(0, -2)),
    fontWeight: `${style.fontWeight}`,
    lineHeight:  parseInt(style.lineHeight.slice(0, -2)),
    letterSpacing: parseInt(style.letterSpacing.slice(0, -2)), // TODO: This doesn't work with percentages, the letterSpacing property may be unusable until I figure this out
  }
}

export function parseTextStylesForDownload(arr: TextStyle[]) {
let code = '';
  let codeObj = {} as { [key: string]: any };
  let dupCnt = {} as { [key: string]: number };

  arr.forEach((textStyle) => {
    let style: { [key: string]: any } = processTextStyle(textStyle);
    let rnStyle = parseTextStylesForReactNative(style)

    // TODO: Get the color for the text style. If the document has a string with that text style, use the color of that text node. 
    const originKey = getDepthName(textStyle.name);
    const key = checkDuplicatedName(originKey, codeObj, dupCnt);
    const pascalCaseKey = convertKebabToPascal(key);
    codeObj[pascalCaseKey] = rnStyle;
  });

  code = JSON.stringify(codeObj, null, 2);

  return arr.length
  // Remove the opening bracket and newline from the stringified JSON object
  // to allow for the opening bracket to be on the same line as the opening parenthesis
    ? `export const textStyles = StyleSheet.create({\n${code.slice(2)})\n`
    : '';
}