const pinyin = require('mini-pinyin')

const removeLineNumbersAndPunctuation = text =>
  text.replace(/\s*[0-9]+\s*/g, ' ').replace(/[\.?!,;:，。]/g, '')

const PINYIN_MODIFICATIONS = {
  ['ā']: 'a',
  ['ē']: 'e',
  ['ī']: 'i',
  ['ō']: 'o',
  ['ū']: 'u',
  ['ǖ']: 'yu',
  ['Ā']: 'A',
  ['Ē']: 'E',
  ['Ī']: 'I',
  ['Ō']: 'O',
  ['Ū']: 'U',
  ['Ǖ']: 'Yu',
  ['ǘ']: 'yú',
  ['Ǘ']: 'Yú',
  ['ǎ']: 'aa',
  ['ě']: 'ee',
  ['ǐ']: 'ii',
  ['ǒ']: 'oo',
  ['ǔ']: 'uu',
  ['ǚ']: 'yuu',
  ['ǜ']: 'yù',
  ['Ǜ']: 'Yù',
}
const toModifiedPinyin = standardPinyin =>
  standardPinyin.replace(/./g, char => PINYIN_MODIFICATIONS[char] || char)

function validatePinyin(original, ruby) {
  const givenLineReadings = removeLineNumbersAndPunctuation(ruby)
    .trim()
    .split(/\s+/)
  return [...removeLineNumbersAndPunctuation(original).trim()].reduce(
    (warnings, character, i) => {
      const expectedReadings = pinyin(character)
      const givenCharacterReadings = givenLineReadings[i].split('/')
      const isValid = expectedReadings.some(expectedCharacterReading =>
        givenCharacterReadings.some(
          characterReading =>
            characterReading === toModifiedPinyin(expectedCharacterReading)
        )
      )

      return isValid
        ? warnings
        : warnings.concat(
            `${character} "${givenLineReadings[i]}" - ${expectedReadings.join(
              ' | '
            )}`
          )
    },
    []
  )
}

const wordBoundaryWithAccents = string =>
  `([^\\wÀ-ÖØ-öø-ſ]|^)${string}(?![\\wÀ-ÖØ-öø-ſ])`

function highlightNewCharactersInPassage(passage, charactersToReadings) {
  const { ruby: rubyLines, original: hanziLines } = passage
  rubyLines.forEach((ruby, lineNumber) => {
    const original = hanziLines[lineNumber]
    const givenLineReadings = removeLineNumbersAndPunctuation(ruby)
      .trim()
      .split(/\s+/)
    const characters = [
      ...removeLineNumbersAndPunctuation(original)
        .trim()
        .replace(/\s+/g, ''),
    ]

    const newIndexes = characters.reduce((indexes, character, i) => {
      const givenReading = givenLineReadings[i]
      const readings = charactersToReadings[character]

      if (!readings || !readings.has(givenReading)) indexes.push(i)
      return indexes
    }, [])

    if (!newIndexes.length) return

    newIndexes.forEach(index => {
      const character = characters[index]
      const reading = givenLineReadings[index]

      const readings = (charactersToReadings[character] =
        charactersToReadings[character] || new Set())
      readings.add(reading)
    })

    const newCharacters = new RegExp(
      `(${newIndexes.map(i => characters[i]).join('|')})`,
      'g'
    )
    const newReadings = new RegExp(
      wordBoundaryWithAccents(
        `(${newIndexes.map(i => givenLineReadings[i]).join('|')})`
      ),
      'g'
    )
    passage.original[lineNumber] = passage.original[lineNumber].replace(
      newCharacters,
      (match, target) => `<u>${target}</u>`
    )
    passage.ruby[lineNumber] = passage.ruby[lineNumber].replace(
      newReadings,
      (match, startPadding, target) => `${startPadding}<u>${target}</u>`
    )
  })

  return passage
}

module.exports = {
  toModifiedPinyin,
  validatePinyin,
  highlightNewCharactersInPassage,
}
