const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const parse = require('./parse')
const eachFile = require('./eachFile')
const HAN_CHARACTERS = require('./hanCharacters')
const { highlightNewCharactersInPassage } = require('./pinyin')

const buildCsv = ({
  paths,
  minimumHanziLength = 8,
  splitPassage = 'byLines',
  highlightNewCharacters = false,
}) => {
  let text = ''
  paths.forEach(path =>
    eachFile(path, filename => (text += readFileSync(filename, 'utf8') + '\n'))
  )

  const parsed = parse(text, splitPassage)

  const newLineBuffer = () => ({
    original: [],
    ruby: [],
    translation: [],
  })
  const lengthenLines = passages => {
    const result = []

    passages.forEach((originalPassage, i) => {
      const { original, ruby, translation } = originalPassage
      const newLines = { original: [], ruby: [], translation: [] }

      let lineBuffer = newLineBuffer()
      original.forEach((line, i) => {
        lineBuffer.original.push(line)
        lineBuffer.ruby.push(ruby[i])
        lineBuffer.translation.push(translation[i])

        const hanInBuffer =
          lineBuffer.original.join('').match(HAN_CHARACTERS) || []

        if (
          i === original.length - 1 ||
          hanInBuffer.length >= minimumHanziLength
        ) {
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

  const sanitizeAndAddLineBreaks = text => {
    if (!text || !text.trim()) return ''

    const sanitized = `"${text.replace(/\"/g, '""')}"`
    return highlightNewCharacters
      ? sanitized.replace(/(\<br\>)?\s*\n/g, '<br>\n')
      : sanitized
  }

  const charactersToReadings = {}

  const csvText = parsed.reduce((output, collection) => {
    const { name: collectionName, passages } = collection
    const addition = lengthenLines(passages).reduce(
      (passagesOutput, passage) => {
        if (highlightNewCharacters)
          highlightNewCharactersInPassage(passage, charactersToReadings)
        const { name, original, ruby, translation } = passage

        return (
          passagesOutput +
          original.reduce(
            (o, originalLine, i) =>
              o +
              `${sanitizeAndAddLineBreaks(
                originalLine
              )},${sanitizeAndAddLineBreaks(
                ruby[i]
              )},${sanitizeAndAddLineBreaks(
                translation[i]
              )},${name},${collectionName},${sanitizeAndAddLineBreaks(
                passage.notes
              )}\n`,
            ''
          )
        )
      },
      ''
    )
    return output + addition + '\n'
  }, '')
  
  return { charactersToReadings, csvText }
}

module.exports = buildCsv