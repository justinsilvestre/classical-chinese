const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const { unparse: unparseCsv, parse: parseCsv } = require('papaparse')
const parse = require('./parse')
const eachFile = require('./eachFile')
const HAN_CHARACTERS = require('./hanCharacters')
const buildCsv = require('./buildCsv')

const paths = [
  './texts/ctp/',
  './texts/sanzijing.md',
  './texts/daodejing.md',
]

const {
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

    const isDaodejingLine = line => line[4] && line[4].includes('ddj')
    const daodejingCsvLines = originalCsvTextLines
      .filter(isDaodejingLine)
      .map((line, index) => {
        const [
          original,
          pronunciation,
          meaning,
          verseNumber,
          tags,
          notes
        ] = line
        return [
          `道德經 ${String(index + 1).padStart(2, '0')}`,
          original,
          pronunciation,
          meaning,
          verseNumber,
          `[sound:daodejing_wangbi_${index + 1}.mp3]`,
          tags,
        ]
      })
    
      if (daodejingCsvLines.length !==  81) throw new Error(daodejingCsvLines.length)
        
writeFileSync('sanzijing-flashcards.csv', unparseCsv(sanzijingCsvTextLines))
writeFileSync('daodejing-flashcards.csv', unparseCsv(daodejingCsvLines))



if (showCharacterCount)
  console.log(
    Object.keys(charactersToReadings).length,
    Object.keys(charactersToReadings).join('')
  )
