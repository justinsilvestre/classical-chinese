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
  const givenReadings = removeLineNumbers(ruby.trim()).split(/\s+/)
  return [...removeLineNumbers(hanzi).trim()].reduce((warnings, character, i) => {
    const expectedReadings = pinyin(character)
    const givenReading = givenReadings[i]
    const isValid = expectedReadings.some(reading =>
      toModifiedPinyin(reading) === givenReading
    )
    return isValid
    ? warnings
    : warnings.concat(`${character} "${givenReading}" - ${expectedReadings.join(' | ')}`)
  }, [])
}

module.exports = { toModifiedPinyin, validatePinyin }
