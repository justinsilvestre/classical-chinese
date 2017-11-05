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

function pinyinIsValid(hanzi, ruby) {
  const givenReadings = removeLineNumbers(ruby.trim()).split(/\s+/)
  return [...removeLineNumbers(hanzi).trim()].every((character, i) => {
    const expectedReadings = pinyin(character)
    return expectedReadings.some(reading =>
      toModifiedPinyin(reading) === givenReadings[i]
    )
  })
}

module.exports = { toModifiedPinyin, pinyinIsValid }
