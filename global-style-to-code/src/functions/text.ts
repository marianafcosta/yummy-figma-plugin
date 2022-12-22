import { TextStyling } from './class';
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

// parse
export function parseTextStyle(arr: TextStyle[], mode: string) {
  let code = '';
  let codeObj = {} as { [key: string]: any };
  let dupCnt = {} as { [key: string]: number };

  arr.forEach((textStyle) => {
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

    // TODO: Get the color for the text style. If the document has a string with that text style, use the color of that text node. 

    const originKey = getDepthName(textStyle.name);
    const key = checkDuplicatedName(originKey, codeObj, dupCnt);
    const pascalCaseKey = convertKebabToPascal(key);
    codeObj[pascalCaseKey] = style;
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
  } else {
    code = JSON.stringify(codeObj, null, 2);
  }

  return arr.length
    ? `//text style \nexport const textStyles = StyleSheet.create(\n${code}\n)`
    : `//no assigned global text code\n`;
}
