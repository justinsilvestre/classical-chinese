const { parse: parseMarkdown } = require('markdown-to-ast')
const HAN_CHARACTERS = require('./hanCharacters')
const pinyinIsValid = require('./pinyinIsValid')

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
  return children.reduce((collections, node) => {
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
      const invalidGloss = fieldType === 'original' ? currentPassage.original.findIndex((line, i) =>
        !pinyinIsValid(line, currentPassage.ruby[i])
      ) : -1
      if (invalidGloss !== -1) {
        console.log(invalidGloss)
        throw new Error(`Invalid ruby text in ${currentPassage.name}: ${currentPassage.original[invalidGloss]} (${currentPassage.ruby[invalidGloss]})`)
      }
    } else {
      throw new Error(`Invalid format: ${JSON.stringify(node)}`)
    }
    return collections
  }, [])
}
