const yaml = require('yaml')
const fs = require('fs')
const joyo = require('../../src/joyo')
const { toNew } = require('../../src/shinjitai')

const extra = '\n 　、，。；《》？！'

const aozoraFrequencyList = require('../../src/aozoraFrequency')

const byFrequency = (a, b) => aozoraFrequencyList.indexOf(a) - aozoraFrequencyList.indexOf(b)

const getUniqueCharacters = (string) => {
  return [...[...string].reduce((set, char) => {set.add(char); return set }, new Set())]
    .filter(c => !extra.includes(c))
    .sort(byFrequency)
    .join('')
}

const poems = yaml.parse(fs.readFileSync('./texts/hrcpw/poems.yml', 'utf8')).map(({ text }) => text).join('')

const sanzijing = require('../../src/sanzijingText.js')

const qianziwen = `天地玄黃　宇宙洪荒
日月盈昃　辰宿列張
寒來暑往　秋收冬藏
閏餘成歲　律召調陽
雲騰致雨　露結爲霜
金生麗水　玉出崑岡
劍號巨闕　珠稱夜光
果珍李柰　菜重芥薑
海鹹河淡　鱗潛羽翔
龍師火帝　鳥官人皇
始制文字　乃服衣裳
推位讓國　有虞陶唐
弔民伐罪　周發殷湯
坐朝問道　垂拱平章
愛育黎首　臣伏戎羌
遐邇壹體　率賓歸王
鳴鳳在樹　白駒食場
化被草木　賴及萬方
蓋此身髮　四大五常
恭惟鞠養　豈敢毀傷
女慕貞絜　男效才良
知過必改　得能莫忘
罔談彼短　靡恃己長
信使可覆　器欲難量
墨悲絲淬　詩讃羔羊
景行維賢　克念作聖
德建名立　形端表正
空谷傳聲　虛堂習聽
禍因惡積　福緣善慶
尺璧非寶　寸陰是競
資父事君　曰嚴與敬
孝當竭力　忠則盡命
臨深履薄　夙興溫凊
似蘭斯馨　如松之盛
川流不息　淵澄取映
容止若思　言辭安定
篤初誠美　慎終宜令
榮業所基　籍甚無竟
學優登仕　攝職從政
存以甘棠　去而益詠
樂殊貴賤　禮別尊卑
上咊下睦　夫唱婦隨
外受傅訓　入奉母儀
諸姑伯叔　猶子比兒
孔懷兄弟　同气連枝
交友投分　切磨箴規
仁慈隱惻　造次弗離
節義廉退　顛沛匪虧
性靜情逸　心動神疲
守眞志滿　逐物意移
堅持雅操　好爵自縻
都邑華夏　東西二京
背邙面洛　浮渭據涇
宮殿盤鬱　樓觀飛驚
圖寫禽獸　畫彩仙靈
丙舍傍啟　甲帳對楹
肆筵設席　鼓瑟吹笙
升階納陛　弁轉疑星
右通廣內　左達承明
既集墳典　亦聚羣英
杜稾鍾隸　漆書壁經
府羅將相　路俠槐卿
戶封八縣　家給千兵
高冠陪輦　驅轂振纓
世祿侈富　車駕肥輕
策功茂實　勒碑刻銘
磻溪伊尹　佐時阿衡
奄宅曲阜　微旦孰營
桓公匡合　濟弱扶傾
綺迴漢惠　說感武丁
俊乂密勿　多士寔寧
晉楚更霸　趙魏困橫
假途滅虢　踐土會盟
何遵約法　韓弊煩刑
起翦頗牧　用軍最精
宣威沙漠　馳譽丹青
九州禹跡　百郡秦并
嶽宗恆岱　禪主云亭
雁門紫塞　雞田赤城
昆池碣石　鉅野洞庭
曠遠緜邈　巖岫杳冥
治本於農　務茲稼穡
俶載南畝　我藝黍稷
稅熟貢新　勸賞黜陟
孟軻敦素　史魚秉直
庶幾中庸　勞謙謹敕
聆音察理　鑑皃辧色
貽厥嘉猷　勉其祗植
省躬譏誡　寵增抗極
殆辱近恥　林皋幸即
兩疏見機　解組誰逼
索居閒處　沈默寂寥
求古尋論　散慮逍遙
欣奏累遣　慼謝歡招
渠荷的歷　園莽抽條
枇杷晚翠　梧桐早凋
陳根委翳　落葉飄颻
游鯤獨運　夌摩絳霄
耽讀翫市　寓目囊箱
易輶攸畏　屬耳垣牆
具膳喰飯　適口充腸
飽飫亯宰　飢厭糟糠
親戚故舊　老少異糧
妾御績紡　侍巾帷房
紈扇圓潔　銀燭煒煌
晝瞑夕寐　籃筍象牀
弦歌酒讌　接杯舉觴
矯手頓足　悅豫且康
嫡後嗣續　祭祀烝嘗
稽顙再拜　悚懼恐惶
箋牒簡要　顧答審詳
骸垢想浴　執熱願涼
驢騾犢特　駭躍超驤
誅斬賊盜　捕獲叛亡
布射遼丸　嵇琴阮嘯
恬筆倫紙　鈞巧任釣
釋紛利俗　並皆佳妙
毛施淑姿　工顰妍笑
秊矢每催　曦暉朗耀
琁璣懸斡　晦魄環照
指薪脩祜　永綏吉劭
矩步引領　俯仰廊廟
束帶矜莊　徘徊瞻眺
孤陋寡聞　愚蒙等誚
謂語助者　焉哉乎也`

const daodejing = require('../../src/daodejing.json').map(({ original }) => original).join('')

const combined = toNew(poems
  + sanzijing
  + qianziwen
  // + daodejing
  )

const unique = getUniqueCharacters(combined)

console.log(unique.length + ' met', unique)

console.log('\n\n')

const unmetJoyo = [...joyo].filter(c => !unique.includes(c)).sort(byFrequency).join('')
console.log(unmetJoyo.length + ' unmet joyo', unmetJoyo)
console.log('---')
const metNonJoyo = [...unique].filter(c => !joyo.includes(c)).join('')

console.log('\n\n')
console.log(metNonJoyo.length + ' non-joyo met', metNonJoyo)

console.log('\n\n')

const metJoyo = [...joyo].filter(c => unique.includes(c)).sort(byFrequency).join('')
console.log(metJoyo.length + ' met joyo', metJoyo)


