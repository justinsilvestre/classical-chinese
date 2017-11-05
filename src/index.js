const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const parse = require('./parse')
const HAN_CHARACTERS = require('./hanCharacters')

const {
  _: filenames,
  out = 'flashcards.csv',
  mhz: minimumHanziLength = 8,
  sp: splitPassage = 'byLines',
} = argv

const text = filenames
  .map(filename => readFileSync(filename, 'utf8'))
  .join('\n')
const parsed = parse(text, splitPassage)

const newLineBuffer = () => ({
  original: [],
  ruby: [],
  translation: [],
})
const lengthenLines = (passages) => {
  const result = []

  passages.forEach((originalPassage, i) => {
    const { original, ruby, translation } = originalPassage
    const newLines = { original: [], ruby: [], translation: [] }

    let lineBuffer = newLineBuffer()
    original.forEach((line, i) => {
      lineBuffer.original.push(line)
      lineBuffer.ruby.push(ruby[i])
      lineBuffer.translation.push(translation[i])

      const hanInBuffer = lineBuffer.original.join('').match(HAN_CHARACTERS) || []

      if (i === original.length - 1 || hanInBuffer.length >= minimumHanziLength) {
        newLines.original.push(lineBuffer.original.join('\n'))
        newLines.ruby.push(lineBuffer.ruby.join('\n'))
        newLines.translation.push(lineBuffer.translation.join('\n'))

        lineBuffer = newLineBuffer()
      }
    })

    result.push(Object.assign({}, originalPassage, newLines))
  })

  return result
}

const sanitize = (text) => `"${text.replace(/\"/g, '\"\"')}"`

writeFileSync(out, parsed.reduce((output, collection) => {
  const { name: collectionName, passages } = collection
  const addition = lengthenLines(passages).reduce((passagesOutput, passage) => {
    const { name, original, ruby, translation } = passage

    return passagesOutput + original.reduce((o, originalLine, i) =>
      o + `${sanitize(originalLine)},${sanitize(ruby[i])},${sanitize(translation[i])},${name},${collectionName}\n`
    , '')
  }, '')
  return output + addition + '\n'
}, ''))
