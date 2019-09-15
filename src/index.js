const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const parse = require('./parse')
const eachFile = require('./eachFile')
const HAN_CHARACTERS = require('./hanCharacters')
const buildCsv = require('./buildCsv')

const {
  _: paths,
  out = 'flashcards.csv',
  mhz: minimumHanziLength = 8,
  sp: splitPassage = 'byLines',
  hnc: highlightNewCharacters = false,
  scc: showCharacterCount = true,
} = argv

const { csvText, charactersToReadings } = buildCsv({
  paths,
  splitPassage,
  highlightNewCharacters,
  showCharacterCount,
})

writeFileSync(out, csvText)

if (showCharacterCount)
  console.log(
    Object.keys(charactersToReadings).length,
    Object.keys(charactersToReadings).join('')
  )
