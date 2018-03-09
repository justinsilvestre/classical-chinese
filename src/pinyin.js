const pinyin = require('mini-pinyin')

const removeLineNumbers = (text) => text.replace(/^\s*[0-9]+\s*/, '')

const PINYIN_MODIFICATIONS = {
  ['ā']: 'a', ['ē']: 'e', ['ī']: 'i', ['ō']: 'o', ['ū']: 'u', ['ǖ']: 'yu',
  ['Ā']: 'A', ['Ē']: 'E', ['Ī']: 'I', ['Ō']: 'O', ['Ū']: 'U', ['Ǖ']: 'Yu',
  ['ǘ']: 'yú', ['Ǘ']: 'Yú',
  ['ǎ']: 'aa', ['ě']: 'ee', ['ǐ']: 'ii', ['ǒ']: 'oo', ['ǔ']: 'uu', ['ǚ']: 'yuu',
  ['ǜ']: 'yù', ['Ǜ']: 'Yù',
}
const toModifiedPinyin = (standardPinyin) => standardPinyin.replace(/./g, (char) =>
  PINYIN_MODIFICATIONS[char] || char
)

function validatePinyin(hanzi, ruby) {
  const givenLineReadings = removeLineNumbers(ruby.trim()).split(/\s+/)
  return [...removeLineNumbers(hanzi).trim()].reduce((warnings, character, i) => {
    const expectedReadings = pinyin(character)
    const givenCharacterReadings = givenLineReadings[i].split('/')
    const isValid = expectedReadings.some(expectedCharacterReading =>
      givenCharacterReadings.some((characterReading) => characterReading === toModifiedPinyin(expectedCharacterReading))
    )
    return isValid
    ? warnings
    : warnings.concat(`${character} "${givenLineReadings[i]}" - ${expectedReadings.join(' | ')}`)
  }, [])
}

module.exports = { toModifiedPinyin, validatePinyin }
