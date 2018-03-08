const { readFileSync, writeFileSync } = require('fs')
const { argv } = require('yargs')
const parse = require('./parse')
const eachFile = require('./eachFile')

const { _: [path], out = 'formatted.md' } = argv

const range = (length) => [...Array(length).keys()]

// assumes arrays of equal length
const flatZip = (arrays, chunkLength = 4) => {
  const chunksCount = Math.ceil(arrays[0].length / chunkLength)
  return range(chunksCount).reduce((all, chunkIndex) => [
    ...all,
    ...arrays.reduce((all, array) => [
      ...all,
      ...array.slice(chunkIndex * chunkLength, chunkIndex * chunkLength + chunkLength),
    ], []),
  ], [])
}

const lineNumber = (linesCount, i) => String(i + 1).padStart(String(linesCount).length, '0')
const isParagraphEnd = (linesCount, i) =>  (i + 1) % 4 === 0 || i === linesCount - 1
const formatLines = linesCount => lines => lines.map((line, i) => {
  const start = `${lineNumber(linesCount, i)} `
  const end = isParagraphEnd(linesCount, i) ? '\n': '  '
  return (line.startsWith(start) ? '' : start)
    + line
    + (line.endsWith(end) ? '' : end)
})

const formatPoems = doc => {
  const collections = parse(doc)
  return collections.reduce((lines, { name: collectionName, passages }) => [
    ...lines,
    `# ${collectionName}\n`,
    ...passages.reduce((lines, { name: passageName, ruby, original, translation }) => [
      ...lines,
      `## ${passageName}\n`,
      ...flatZip([ruby, original, translation].map(formatLines(original.length)))
    ], []),
  ], []).join('\n')
}

const fileContents = readFileSync(path, 'utf8')
writeFileSync(out, formatPoems(fileContents))
