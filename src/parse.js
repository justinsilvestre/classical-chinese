const { parse: parseMarkdown } = require('markdown-to-ast')
const HAN_CHARACTERS = require('./hanCharacters')

const getFieldType = (text, { ruby, original, translation }) => {
  if (HAN_CHARACTERS.test(text)) {
    return 'original'
  } else if (original.length) {
    return 'translation'
  } else {
    return 'ruby'
  }
}

module.exports = function parse(parallelText) {
  const { children } = parseMarkdown(parallelText)
  return children.reduce((collections, node) => {
    const { type, depth } = node
    if (type === 'Header' && depth === 1) {
      collections.push({ name: node.children[0].value, passages: [] })
    } else {
      const currentCollection = collections[collections.length - 1]

      if (type === 'Header' && depth === 2) {
        currentCollection.passages.push({
          name: node.children[0].value,
          ruby: [],
          original: [],
          translation: [],
        })
      } else {
        const { passages } = currentCollection
        const currentPassage = passages[passages.length - 1]
        const text = node.raw
        const fieldType = getFieldType(text, currentPassage)
        text.split(/\s*\n+\s*/).forEach(line =>
          currentPassage[fieldType].push(line)
        )
      }
    }

    return collections
  }, [])

  // return children.filter(({ type, depth }) =>
  //   type === 'Header' && depth === 1
  // ).map(({ children: [{ value }]}) => ({
  //   name: value,
  //   passages: children.filter(({ type, depth }) =>
  //     type === 'Header' && depth === 2
  //   ).,
  // }))
}
