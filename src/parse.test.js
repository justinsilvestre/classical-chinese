const parse = require('./parse')

const splitLines = (text) => text.split(/\s*\n\s*/)

const PASSAGE_1 = {
  name: 'passageName1',
  ruby: `kong shan bù jiàn rén
    dàn wén rén yuu xiaang
    faan yiing rù shen lín
    fù zhào qing tái shàng`,
  original: `空山不見人
    但聞人語響
    返景入深林
    復照青苔上`,
  translation: `On the empty mountains I see no one,
    I only hear the distant echo of people talking.
    The returning sunbeams enter deep into the woods
    And shine again on the green moss.`
}

const PASSAGE_2 = {
  name: 'passageName2',
  ruby: [
    `1 zhòu yuu qing qiu yè
    2 jin bo geeng yù shéng
    3 tian hé yuán zì bái
    4 jiang puu xiàng lái chéng`,
    `5 yìng wù lián zhu duàn
    6 yuán kong yi jìng sheng
    7 yú guang yiin geng lòu
    8 kuàng naai lù huá níng`,
  ],
  original: [
    `1 驟雨清秋夜
    2 金波耿玉繩
    3 天河元自白
    4 江浦向來澄`,
    `5 映物連珠斷
    6 緣空一鏡升
    7 餘光隱更漏
    8 況乃露華凝`,
  ],
  translation: [
    `1 A sudden shower has made this autumn night even clearer;
    2 The gilded waves make the jewel-strings (of stars) even brighter.
    3 Now we can see how white the Milky Way actually is.
    4 How clear [the water by] the bank has been all along.`,
    `5 When reflected in things the connected beads (= stars) snap;
    6 Climbing the void, a single mirror (= moon) rises.
    7 The night-watch water-clock dims the fading light (of stars and moon).
    8 The more so as the splendour of the dew condenses (and compensates for it).`,
  ]
}
const PASSAGE_3 = {
  name: 'passageName3',
  ruby: 'dú zuò you huáng lii',
  original: '獨坐幽篁裡',
  translation: 'I sit alone in a secluded bamboo-grove.',
}

const TEXT = `
# collectionName1

## ${PASSAGE_1.name}

${PASSAGE_1.ruby}

${PASSAGE_1.original}

${PASSAGE_1.translation}
## ${PASSAGE_2.name}

${PASSAGE_2.ruby[0]}

${PASSAGE_2.original[0]}

${PASSAGE_2.translation[0]}

${PASSAGE_2.ruby[1]}

${PASSAGE_2.original[1]}

${PASSAGE_2.translation[1]}
# collectionName2
## ${PASSAGE_3.name}

${PASSAGE_3.ruby}

${PASSAGE_3.original}

${PASSAGE_3.translation}
`

describe('parse', () => {
  const parsed = parse(TEXT)

  const [collection1, collection2] = parsed

  it('parses collections', () => {
    expect(collection1.name).toEqual('collectionName1')
    expect(collection2.name).toEqual('collectionName2')
    expect(collection1.passages.length).toEqual(2)
    expect(collection2.passages.length).toEqual(1)
  })

  it('parses single-paragraph passage', () => {
    const { passages: [passage] } = collection1

    expect(passage).toEqual({
      name: 'passageName1',
      ruby: splitLines(PASSAGE_1.ruby),
      original: splitLines(PASSAGE_1.original),
      translation: splitLines(PASSAGE_1.translation),
    })
  })

  it('parses multi-paragraph passage', () => {
    const { passages: [, passage] } = collection1
    expect(passage).toEqual({
      name: 'passageName2',
      ruby: splitLines(PASSAGE_2.ruby.join('\n')),
      original: splitLines(PASSAGE_2.original.join('\n')),
      translation: splitLines(PASSAGE_2.translation.join('\n')),
    })
  })

  it('throws an error if syntax other than headers (1 and 2) and paragraph is used', () => {
    expect(() => parse(`
      - this is a list item
      - this is a list item
    `)).toThrow()
  })
})
