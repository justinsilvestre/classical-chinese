const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const HAN_CHARACTERS = require('./hanCharacters')

const { _: filenames, out = 'vocab.txt' } = argv

const text = filenames.map(fn => readFileSync(fn, 'utf8')).join('')
const textWithoutSources = text.replace(/[\n\r]## .+[\n\r]/g, '')
const uniqueCharacters = new Set([...textWithoutSources])
const hanCharacters = [...uniqueCharacters].filter(c => HAN_CHARACTERS.test(c))

console.log(HAN_CHARACTERS)
