const { parse: parseMarkdown } = require('markdown-to-ast')
const HAN_CHARACTERS = require('./hanCharacters')
const { validatePinyin, highlightNewCharactersInPassage } = require('./pinyin')

const getFieldType = (text, { ruby, original, translation }) => {
  if (HAN_CHARACTERS.test(text)) {
    return 'original'
  } else if (translation.length < ruby.length) {
    return 'translation'
  } else {
    return 'ruby'
  }
}

const lastIn = arr => arr[arr.length - 1]

const SPLIT_PASSAGE = {
  byParagraphs({ type, raw }, collections) {
    const { passages } = lastIn(collections)
    const currentPassage = passages[passages.length - 1]
    const fieldType = getFieldType(raw, currentPassage)
    raw.split(/\s*\n{2,}\s*/).forEach(line => {
      currentPassage[fieldType].push(line)
    })
  },
  byLines({ type, raw }, collections) {
    const { passages } = lastIn(collections)
    const currentPassage = passages[passages.length - 1]
    const fieldType = getFieldType(raw, currentPassage)
    raw.split(/\s*\n+\s*/).forEach(line => {
      currentPassage[fieldType].push(line)
    })
  },
}

module.exports = function parse(
  parallelText,
  splitPassage = 'byLines',
  highlightNewCharacters
) {
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
      SPLIT_PASSAGE[splitPassage](node, collections)
    } else if (type === 'BlockQuote') {
      lastIn(lastIn(collections).passages).notes = node.raw
        .replace('\n', '  \n')
        .replace(/^\>\s+/g, '')
    } else {
      throw new Error(`Invalid format: ${JSON.stringify(node)}`)
    }
    return collections
  }, [])

  parsed.forEach(({ name: collectionName, passages }) => {
    return passages
      .map(({ original, ruby, ...rest }) => ({
        original: original.flatMap(paragraphOrLine =>
          paragraphOrLine.split(/\s*\n\s*/g)
        ),
        ruby: ruby.flatMap(paragraphOrLine =>
          paragraphOrLine.split(/\s*\n\s*/g)
        ),
        ...rest,
      }))
      .map(passage => {
        const { original, ruby, name: passageName } = passage
        original.forEach((line, lineNumber) => {
          const rubyLine = ruby[lineNumber]
          const warnings = validatePinyin(line, rubyLine)
          if (warnings.length) {
            console.warn(
              `Check ruby text for ${collectionName}, ${passageName}: ${line} (${rubyLine})`
            )
            warnings.forEach(warning => console.log('  ' + warning))
          }
        })

        return passage
      })
  })
  return parsed
}
