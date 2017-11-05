const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const { toModifiedPinyin } = require('./pinyin')

const { _: filenames, out = 'modified-pinyin.csv' } = argv

writeFileSync(out, filenames.reduce((output, filename) => {
  const addition = toModifiedPinyin(readFileSync(filename, 'utf8'))
  return output + addition + '\n'
}, ''))
