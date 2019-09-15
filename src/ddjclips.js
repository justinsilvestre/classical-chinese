const { writeFileSync } = require('fs')
const { toModifiedPinyin } = require('./pinyin')
const clips = require('./tempclips')

const afcaClips = Object.values(clips)

const ddjClips = afcaClips
  .filter((clip) => clip.flashcard.tags.includes('ddj'))
  .sort(({ start: a }, { start: b}) => a - b)

if (ddjClips.length !== 81) throw new Error(ddjClips.length)

const daodejing = require('./daodejing.json')

const joinParagraphs = (str) => str.replace(/\n\n/g, '  \n  \n')

const newClips = ddjClips.map((clip, index) => {
  const chapter = daodejing[index]

  return {
    clip,
    ruby: toModifiedPinyin(chapter.ruby),
    original: chapter.original,
    translation: chapter.translation,
  }
}).reduce((clipsMap, { ruby, original, translation, clip }, index) => {
  clipsMap[clip.id] = {
    ...clip,
    flashcard: {
      ...clip.flashcard,
      fields: {
        ...clip.flashcard.fields,
        transcription: joinParagraphs(original.trim()),
        meaning: joinParagraphs(translation.trim()),
        pronunciation: joinParagraphs(ruby.trim()),
        notes: `第${index + 1}章`
      }
    }
  }

  return clipsMap
}, { ...clips })

const text = JSON.stringify(newClips, null, 2)

writeFileSync('./ddjClipsResult.json', text)