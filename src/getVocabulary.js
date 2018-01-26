const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const HAN_CHARACTERS = require('./hanCharacters')
const eachFile = require('./eachFile')

const { _: paths, out = 'vocab.txt' } = argv

let text = ''
paths.forEach(path =>
  eachFile(path, filename => text += readFileSync(filename, 'utf8'))
)
const textWithoutSources = text.replace(/[\n\r]## .+[\n\r]/g, '')
const uniqueCharacters = new Set([...textWithoutSources])
const hanCharacters = [...uniqueCharacters].filter(c => c.match(HAN_CHARACTERS))
console.log(hanCharacters.join(''))
