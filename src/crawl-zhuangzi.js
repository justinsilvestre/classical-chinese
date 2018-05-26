const Crawler = require('crawler')

const crawler = new Crawler({ maxConnections: 10 })

const crawl = (uri) => new Promise((resolve, reject) => {
  crawler.queue({ uri, callback: function (error, response, done) {
    if (error) {
      reject(error)
    } else {
      resolve(response)
    }
    done()
  } })
})

var zhuangziUrls = [
"https://ctext.org/zhuangzi/enjoyment-in-untroubled-ease", "https://ctext.org/zhuangzi/adjustment-of-controversies", "https://ctext.org/zhuangzi/nourishing-the-lord-of-life", "https://ctext.org/zhuangzi/man-in-the-world-associated-with", "https://ctext.org/zhuangzi/seal-of-virtue-complete", "https://ctext.org/zhuangzi/great-and-most-honoured-master", "https://ctext.org/zhuangzi/normal-course-for-rulers-and-kings",
"https://ctext.org/zhuangzi/webbed-toes", "https://ctext.org/zhuangzi/horsess-hoofs", "https://ctext.org/zhuangzi/cutting-open-satchels", "https://ctext.org/zhuangzi/letting-be-and-exercising-forbearance", "https://ctext.org/zhuangzi/heaven-and-earth", "https://ctext.org/zhuangzi/tian-dao", "https://ctext.org/zhuangzi/revolution-of-heaven", "https://ctext.org/zhuangzi/ingrained-ideas", "https://ctext.org/zhuangzi/correcting-the-nature", "https://ctext.org/zhuangzi/floods-of-autumn", "https://ctext.org/zhuangzi/perfect-enjoyment", "https://ctext.org/zhuangzi/full-understanding-of-life", "https://ctext.org/zhuangzi/tree-on-the-mountain", "https://ctext.org/zhuangzi/tian-zi-fang", "https://ctext.org/zhuangzi/knowledge-rambling-in-the-north",
"https://ctext.org/zhuangzi/geng-sang-chu", "https://ctext.org/zhuangzi/xu-wu-gui", "https://ctext.org/zhuangzi/ze-yang", "https://ctext.org/zhuangzi/what-comes-from-without", "https://ctext.org/zhuangzi/metaphorical-language", "https://ctext.org/zhuangzi/kings-who-have-wished-to-resign", "https://ctext.org/zhuangzi/robber-zhi", "https://ctext.org/zhuangzi/delight-in-the-sword-fight", "https://ctext.org/zhuangzi/old-fisherman", "https://ctext.org/zhuangzi/lie-yu-kou", "https://ctext.org/zhuangzi/tian-xia"
]

Promise.all(zhuangziUrls.map(url => crawl(url))).then((responses) => {
  const text = responses.reduce((all, { $ }) =>
    all + $('td:not(.opt).ctext').text()
  , '')
  const uniqChars = [...new Set([...text])].join('')
  console.log(uniqChars)
})
