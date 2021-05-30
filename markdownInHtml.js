const testStr = "# H1\n###### H6\n\n## 段落 `p`\n\n两个`空行`中包含的文字是段落这是一个段落,它的前后都是空行\n\n## 换行 `br`\n如果要在段落中换行(即:插入 `<br>`), 在行尾打`两个空格`即可\n\n注意此行末尾有两个空格  \n我换行了\n\n## 引用 `blockquote`\n单行引用\n\n## 列表 `ul,ol`\n### 无序列表 `ul`\n使用 `+` `-` `*` 中任意一个符号,加上`空格`(空格推荐3个,方便嵌套).\n\n_   项目1\n-   项目二\n\n### 有序列表 `ol`\n使用数字和`.`加`空格` (空格推荐2个, 数字可以不按顺序)\n\n1.  项目1\n2.  项目2\n\n## 代码 `figure,pre,code`\n\n### 行内代码 `code`\n\n使用 ` 符号来包含代码\n\n### 普通代码块\n缩进四个空格\n\n// 注意: 每行开头都 缩进了四个空格\n$php_arr = array('hello' =&gt; 'world');\necho $php_arr;\n\n## 分隔线 `hr`\n推荐使用减号; `*` `-` `_` (至少连续使用3次)\n\n---\n***\n__________________\n\n<p>123<b>hello</b></p>\n\n<script>\n    console.log(123)\n</script>\n\n## 耳机目录\n\ndofjsdf\n\n# 一级\n\n测试\n"

const getHtmlStr = () => document.body.innerHTML

const splitHtmlStr = htmlStr => htmlStr.split('\n')

const getHeadings = str => {
  const matchs = str.match(/(^#{1,6} )(.*)/)
  if (matchs === null) return false
  return {
    htmlMarkup: `h${matchs[1].length - 1}`,
    text: matchs[2],
    markdownMarkup: matchs[1],
  }
}

const parseHeadings = str => {
  const heading = getHeadings(str)
  if (heading === false) return str
  return `<${heading.htmlMarkup}>${heading.text}</${heading.htmlMarkup}>`
}

const parseHtmlMarkdown = () => {
  const htmlStrArr = splitHtmlStr(getHtmlStr())
  const parsedHtmlArr = htmlStrArr.map(item => parseHeadings(item))
  const parsedHtmlStr = parsedHtmlArr.join('')
  console.log(parsedHtmlStr)
  document.body.innerHTML = parsedHtmlStr
  // const htmlParsedStr = getHeadings(htmlStrArr)
}

window.onload = parseHtmlMarkdown