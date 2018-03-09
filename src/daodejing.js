const { readFileSync, writeFileSync } = require('fs')
const chapters = require('./daodejing.json')
const { toModifiedPinyin } = require('./pinyin')

const removeExcessNewlines = (string) => string.replace('\n\n', '\n')

chapters.forEach(({ ruby, original, translation }, i) => {
  const chapterNumber = String(i + 1).padStart(2, '0')
  const out = `# daodejing${chapterNumber}

## ${i + 1}

${removeExcessNewlines(toModifiedPinyin(ruby.trim()))}

${removeExcessNewlines(original.trim())}

${removeExcessNewlines(translation.trim())}
`
  writeFileSync(`./texts/daodejing/daodejing${chapterNumber}.md`, out)
})
