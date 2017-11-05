const { parse: parseMarkdown } = require('markdown-to-ast')
const HAN_CHARACTERS = require('./hanCharacters')
const { pinyinIsValid } = require('./pinyin')

const getFieldType = (text, { ruby, original, translation }) => {
  if (HAN_CHARACTERS.test(text)) {
    return 'original'
  } else if (translation.length < ruby.length) {
    return 'translation'
  } else {
    return 'ruby'
  }
}

const lastIn = (arr) => arr[arr.length - 1]

module.exports = function parse(parallelText) {
  const { children } = parseMarkdown(parallelText)
  const parsed = children.reduce((collections, node) => {
    const { type, depth } = node
    if (type === 'Header' && depth === 1) {
      collections.push({ name: node.children[0].value, passages: [] })
    } else if (type === 'Header' && depth === 2) {
      lastIn(collections).passages.push({
        name: node.children[0].value,
        ruby: [],
        original: [],
        translation: [],
      })
    } else if (type === 'Paragraph') {
      const { passages } = lastIn(collections)
      const currentPassage = passages[passages.length - 1]
      const text = node.raw
      const fieldType = getFieldType(text, currentPassage)
      text.split(/\s*\n+\s*/).forEach(line => {
        currentPassage[fieldType].push(line)
      })
    } else {
      throw new Error(`Invalid format: ${JSON.stringify(node)}`)
    }
    return collections
  }, [])

  parsed.forEach(({ name: collectionName, passages }) => {
    passages.forEach(({ original, ruby, name: passageName }) => {
      original.forEach((line, lineNumber) => {
        const rubyLine = ruby[lineNumber]
        if (!pinyinIsValid(line, rubyLine)) {
          console.warn(`Check ruby text for ${collectionName}, ${passageName}: ${line} (${rubyLine})`)
        }
      })
    })
  })

  return parsed
}
