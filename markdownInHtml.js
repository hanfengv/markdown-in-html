const testStr = "# H1\n###### H6\n\n## 段落 `p`\n\n两个`空行`中包含的文字是段落这是一个段落,它的前后都是空行\n\n## 换行 `br`\n如果要在段落中换行(即:插入 `<br>`), 在行尾打`两个空格`即可\n\n注意此行末尾有两个空格  \n我换行了\n\n## 引用 `blockquote`\n单行引用\n\n## 列表 `ul,ol`\n### 无序列表 `ul`\n使用 `+` `-` `*` 中任意一个符号,加上`空格`(空格推荐3个,方便嵌套).\n\n_   项目1\n-   项目二\n\n### 有序列表 `ol`\n使用数字和`.`加`空格` (空格推荐2个, 数字可以不按顺序)\n\n1.  项目1\n2.  项目2\n\n## 代码 `figure,pre,code`\n\n### 行内代码 `code`\n\n使用 ` 符号来包含代码\n\n### 普通代码块\n缩进四个空格\n\n// 注意: 每行开头都 缩进了四个空格\n$php_arr = array('hello' =&gt; 'world');\necho $php_arr;\n\n## 分隔线 `hr`\n推荐使用减号; `*` `-` `_` (至少连续使用3次)\n\n---\n***\n__________________\n\n<p>123<b>hello</b></p>\n\n<script>\n    console.log(123)\n</script>\n\n## 耳机目录\n\ndofjsdf\n\n# 一级\n\n测试\n";

const PREFIX = "__MDHTML__";

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

// 标题
const getHeadings = (str) => {
  const matchs = str.match(parseMap.get("headings").regExp);
  return matchs ? mdhm(`h${matchs[1]?.length - 1}`, matchs[2], matchs[1], matchs) : mdhm();
};
const parseHeadings = (str) => {
  const mdh = getHeadings(str);
  return `<${mdh.htmlMarkup}>${mdh.text}</${mdh.htmlMarkup}>`;
};

// 加粗
const getBold = (str) => {
  const matchs = str.match(parseMap.get("bold").regExp);
  return matchs ? mdhm("strong", matchs[2], matchs[1], matchs) : mdhm();
};
const parseBold = (str) => {
  const mdh = getBold(str);
  mdh.matchs.forEach((item) => (str = str.replace(item, `<${mdh.htmlMarkup}>${item}</${mdh.htmlMarkup}>`)));
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
    "bold",
    {
      regExp: /([\*|_]{2})([^\*|_]*)\1/g,
      method: parseBold,
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
