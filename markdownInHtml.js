const PREFIX = "__MDHTML__";

var trim = (str, ...chars) => {
  const charStrs = chars.map((char) => `\\${char}`).join("|");
  const reg = new RegExp(`^([${charStrs}])+|([${charStrs}])+$`, "g");
  return str.replace(reg, "");
};

const getHtmlStr = () => document.body.innerHTML;

const replaceHtml = (htmlStr) => {
  return htmlStr.replace(/\n{2,}/g, `\n\n`).replace(/[\-|\*|_]{4,}/g, "---");
};

const splitHtmlStr = (htmlStr) => replaceHtml(htmlStr).split("\n");

const mdhm = (htmlMarkup = "p", text = "", mdMarkup = "", matchs = []) => {
  return {
    htmlMarkup,
    text,
    mdMarkup,
    matchs,
  };
};

// 标题（Headings） #
const getHeadings = (str) => {
  const matchs = str.match(parseMap.get("headings").regExp);
  return matchs ? mdhm(`h${matchs[1]?.length - 1}`, matchs[2], matchs[1], matchs) : mdhm();
};
const parseHeadings = (str) => {
  const mdh = getHeadings(str);
  return `<${mdh.htmlMarkup}>${mdh.text}</${mdh.htmlMarkup}>`;
};

// TODO:: 段落（Paragraphs）
// TODO:: 换行（Line Breaks）

// 粗体（Bold）
const getBold = (str) => {
  const matchs = str.match(parseMap.get("bold").regExp);
  return matchs ? mdhm("strong", matchs[2], matchs[1], matchs) : mdhm();
};
const parseBold = (str) => {
  const mdh = getBold(str);
  mdh.matchs.forEach((item) => (str = str.replace(item, `<${mdh.htmlMarkup}>${trim(item, "*", "_")}</${mdh.htmlMarkup}>`)));
  return str;
};

// 斜体（Italic）
const getItalic = (str) => {
  const matchs = str.match(parseMap.get("italic").regExp);
  return matchs ? mdhm("em", matchs[2], matchs[1], matchs) : mdhm();
};
const parseItalic = (str) => {
  const mdh = getItalic(str);
  mdh.matchs.forEach((item) => (str = str.replace(item, `<${mdh.htmlMarkup}>${trim(item, "*", "_")}</${mdh.htmlMarkup}>`)));
  return str;
};

// 粗体（Bold）和斜体（Italic）
const getBoldItalic = (str) => {
  const matchs = str.match(parseMap.get("boldItalic").regExp);
  return matchs ? mdhm("strong>em", matchs[2], matchs[1], matchs) : mdhm();
};
const parseBoldItalic = (str) => {
  const mdh = getBoldItalic(str);
  mdh.matchs.forEach((item) => (str = str.replace(item, `<strong><em>${trim(item, "*", "_")}</em></strong>`)));
  return str;
};

// 单行引用
const getBlockquotes = (str) => {
  const matchs = str.match(parseMap.get("blockquotes").regExp);
  return matchs ? mdhm("blockquote", matchs[2], matchs[1], matchs) : mdhm();
};
const parseBlockquotes = (str) => {
  const mdh = getBlockquotes(str);
  return `<${mdh.htmlMarkup}>${mdh.text}</${mdh.htmlMarkup}>`;
};

// 分割线
const getHorizontalRules = (str) => {
  const matchs = str.match(parseMap.get("horizontalRules").regExp);
  return matchs ? mdhm("hr", matchs[2], matchs[1], matchs) : mdhm();
};

const parseHorizontalRules = (str) => {
  const mdh = getHorizontalRules(str);
  return `<${mdh.htmlMarkup}/>`;
};

var parseMap = new Map([
  [
    "headings",
    {
      regExp: /(^#{1,6} )(.*)/,
      method: parseHeadings,
    },
  ],
  [
    "boldItalic",
    {
      regExp: /([\*|_]{3})([^\*|_]*)\1/g,
      method: parseBoldItalic,
    },
  ],
  [
    "bold",
    {
      regExp: /([\*|_]{2})([^\*|_]*)\1/g,
      method: parseBold,
    },
  ],
  [
    "italic",
    {
      regExp: /([\*|_]{1})([^\*|_]*)\1/g,
      method: parseItalic,
    },
  ],
  [
    "blockquotes",
    {
      regExp: /(^&gt; )(.*)/,
      method: parseBlockquotes,
    },
  ],
  [
    "horizontalRules",
    {
      regExp: /(^[\-|\*|_]{3,})(.*)/,
      method: parseHorizontalRules,
    },
  ],
]);

const parseArr = [...parseMap].map((item) => {
  return {
    name: item[0],
    ...item[1],
  };
});

const parseRow = (htmlStrArr) => {
  const parses = htmlStrArr.map((htmlStr) => parseArr.filter((parse) => parse.regExp.test(htmlStr)));
  const parsedArr = htmlStrArr.map((htmlStr, index) => {
    parses[index].forEach((parse) => {
      htmlStr = parse.method(htmlStr);
    });
    return htmlStr;
  });
  return parsedArr;
};

const parseHtmlMarkdown = () => {
  const htmlStr = getHtmlStr();
  const htmlStrArr = splitHtmlStr(htmlStr);
  console.log("htmlStrArr::", htmlStrArr);
  const parsedHtmlArr = parseRow(htmlStrArr);

  // const parsedHtmlArr = htmlStrArr
  //   .map((item) => parseHeadings(item));
  // console.log("parsedHtmlArr::", parsedHtmlArr);

  // const parsedHtmlArr = [];

  const parsedHtmlStr = parsedHtmlArr.join("");
  document.body.innerHTML = parsedHtmlStr;
};

window.onload = parseHtmlMarkdown;
