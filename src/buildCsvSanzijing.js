const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const { unparse: unparseCsv, parse: parseCsv } = require('papaparse')
const parse = require('./parse')
const eachFile = require('./eachFile')
const HAN_CHARACTERS = require('./hanCharacters')
const buildCsv = require('./buildCsv')

const paths = [
  './texts/ctp',
  './texts/sanzijing.md',
  './texts/daodejing',
]

const {
  out = 'sanzijing-flashcards.csv',
  mhz: minimumHanziLength = 8,
  sp: splitPassage = 'byParagraphs',
  hnc: highlightNewCharacters = true,
  scc: showCharacterCount = true,
} = argv

const { csvText, charactersToReadings } = buildCsv({
  paths,
  splitPassage,
  highlightNewCharacters,
  showCharacterCount,
})

const originalCsvTextLines = parseCsv(csvText).data.filter(line => line.length)

const isSanzijingLine = line => line[4] && line[4].includes('sanzijing')
const sanzijingCsvTextLines = originalCsvTextLines
  .filter(isSanzijingLine)
  .map((line) => {
    const [
      original,
      pronunciation,
      meaning,
      verseNumber,
      tags,
      notes
    ] = line
    return [
      verseNumber,
      original,
      pronunciation,
      meaning,
      notes,
      tags,
    ]
  })

  if (sanzijingCsvTextLines.length !== 96) throw new Error(sanzijingCsvTextLines.length)

  const sanzijingCsvTextLines = originalCsvTextLines
    .filter(isSanzijingLine)
    .map((line) => {
      const [
        original,
        pronunciation,
        meaning,
        verseNumber,
        tags,
        notes
      ] = line
      return [
        verseNumber,
        original,
        pronunciation,
        meaning,
        notes,
        tags,
      ]
    })

writeFileSync(out, unparseCsv(sanzijingCsvTextLines))

if (showCharacterCount)
  console.log(
    Object.keys(charactersToReadings).length,
    Object.keys(charactersToReadings).join('')
  )
