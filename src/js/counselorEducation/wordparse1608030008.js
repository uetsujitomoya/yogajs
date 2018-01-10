import 'kuromoji'
import $ from 'jquery'
import {select} from './select.js'
import {setForViz} from './setForViz'
import {slider} from 'bootstrap-slider'

let zoomVal = 3

const insertStr = (str, idx, insert) => {
  return str.slice(0, idx) + insert + str.slice(idx, str.length)
}

const readJson = (originalText, event, jsonName) => {
  let signal = 'blue'

  switch (signal) {
    case 'red':
      readJsonAutomatically(jsonName, originalText)
      break
    /*
     case "green":
     case "blue":
     console.log("go!");
     break;
     case "yellow":
     console.log("slow down!");
     break; */
    default:
      readJsonManually(originalText, event)
      break
  }
}

const readJsonAutomatically = (jsonName, originalText) => {
  $.getJSON('./json/' + jsonName + '.json', function (data) {
    originalText = data[0].a
  })
}

const readJsonManually = (originalTxt, e) => {
  console.log(e)
  originalTxt = JSON.parse(e.target.result)
}

const makeOnClick = (c) => {
  document.getElementById('b' + c).onclick = () => {
    const id = 'r' + c
    document.getElementById(id).classList.toggle('hide')
  }
}
const makeOnClickS = (c) => {
  document.getElementById('bs' + c).onclick = () => {
    const id = 'rs' + c
    document.getElementById(id).classList.toggle('hide')
  }
}

const selectGraphShape = function (name, storage, keitaisokaiseki, chboxlist, chboxlist2, RGBlist, hatsugen, bun, checked, checked2, taiou, taiou2, chBoxLen, chBoxLen2, startTime, graph, ranshin, vResult, setForVizInputObj) {
  console.log('%centerred selectGraphShape', 'color:red')

  document.getElementById('GraphSelectButton').onclick = () => {
    console.log('GraphSelectButton_onchange')
    setForViz(name, storage, setForVizInputObj.wordArrayInASentence, chboxlist, chboxlist2, RGBlist, setForVizInputObj.hatsugenArray, setForVizInputObj.contentArrayOfASentence, checked, checked2, taiou, taiou2, chBoxLen, chBoxLen2, startTime, graph, ranshin, setForVizInputObj.zoom_value)
  }// graphの形状を切り替えた際もここで再描画される
}

const classifyWithFirstWordDictionary = (name, aBunWordArr, checkboxlist, chboxlist, chboxlist2, RGBlist, hatsugenArray, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, originalText) => {
  let jsonName = '160803dummy'
  var startTime = new Date()
  console.log(startTime)

  var h, hatsugenBunCnt, aBunWordCnt, k, hatsugenCnt, afterMorphologicalAnalysisWordsCnt, c, x, y, z
  var hinshi = []
  var ansBunCategory = []
  let ranshin = []
  var wordSet = new Set()
  var wordSet2 = []
  var miserables = {'nodes': [], 'links': []}

  checkboxlist = []
  aBunContentArr = []

  console.log('%c enter kuromoji 91', 'color:red')
  return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
    let zoomVal = 3

    let visResult
    //console.log('%c entered kuromoji 95', 'color:red')
    //console.log(originalText)
    const wordsArrayAfterMorphologicalAnalysis = tokenizer.tokenize(originalText)

    afterMorphologicalAnalysisWordsCnt = 0

    var aBunWordsQty = 0
    hatsugenCnt = 0
    var kanjamoji = 0
    var kanjatango = 0
    var kanjabun = 0
    var serapimoji = 0
    var serapitango = 0
    var serapibun = 0
    var soudesuka = 0
    while (afterMorphologicalAnalysisWordsCnt < wordsArrayAfterMorphologicalAnalysis.length) {
      aBunWordArr[hatsugenCnt] = []
      aBunContentArr[hatsugenCnt] = []
      hatsugenArray[hatsugenCnt] = ''
      hinshi[hatsugenCnt] = []
      ansBunCategory[hatsugenCnt] = []
      ranshin[hatsugenCnt] = []
      if (hatsugenCnt % 2 === 0) {
        RGBlist[hatsugenCnt / 2] = [0, 0, 0, 0, 0, 0, 0, 0]
      }
      hatsugenBunCnt = 0
      aBunWordsQty = 0
      while (afterMorphologicalAnalysisWordsCnt < wordsArrayAfterMorphologicalAnalysis.length) {
        aBunWordArr[hatsugenCnt][hatsugenBunCnt] = []
        aBunContentArr[hatsugenCnt][hatsugenBunCnt] = ''
        hinshi[hatsugenCnt][hatsugenBunCnt] = []
        aBunWordArr[hatsugenCnt][hatsugenBunCnt].length = 0
        ansBunCategory[hatsugenCnt][hatsugenBunCnt] = [0, 0, 0]
        ranshin[hatsugenCnt][hatsugenBunCnt] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        aBunWordCnt = 0
        while (afterMorphologicalAnalysisWordsCnt < wordsArrayAfterMorphologicalAnalysis.length) {
          aBunWordsQty++

          if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '。' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '？' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '?' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '：' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === ':' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].word_id === '2613630' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '･･･？：' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === ')：' ||
            wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '…' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '……' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '・・・' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '･･･' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form.indexOf('〈') !== -1 || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form.indexOf('〉') !== -1) {
            break
          }
          if (hatsugenCnt % 2 === 1) {
            kanjatango++
            kanjamoji = kanjamoji + wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form.length
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '母' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '主人' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '父さん' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'ご主人' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'お父さん' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '姉' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '姉さん' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '母親' ||
              wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'お姉さん' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '父' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '家族') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '兄' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '子' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '子ども' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '妹' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '弟') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '両親' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'お母様' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'お父様') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '仕事' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '休み' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'アルバイト' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '働く' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '同僚' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '職場' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '上司' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '部下') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][2] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '友人' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '親友' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '友達' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '友' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '交友' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '友好') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][1] = 1
            }

            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '病' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '病気' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'ストレス' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '不調' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '過食' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '嘔吐' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '過食嘔吐') {
              ranshin[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '無気力' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '気力' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'やる気') {
              ranshin[hatsugenCnt][hatsugenBunCnt][1] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '疑い' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '疑う' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '疑心暗鬼' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '疑心') {
              ranshin[hatsugenCnt][hatsugenBunCnt][2] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '注意' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '不注意' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '注意散漫' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '無自覚' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '自覚') {
              ranshin[hatsugenCnt][hatsugenBunCnt][3] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '引き延ばし' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '引き延ばす' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '怠慢' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '怠惰') {
              ranshin[hatsugenCnt][hatsugenBunCnt][4] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '渇望' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '切望' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '欲しい') {
              ranshin[hatsugenCnt][hatsugenBunCnt][5] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '妄想' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '空想' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '想い' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'ふける') {
              ranshin[hatsugenCnt][hatsugenBunCnt][6] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '抜け出す' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '打破' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '勝つ' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '戦う') {
              ranshin[hatsugenCnt][hatsugenBunCnt][7] = 1
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '不安定' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '安定' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '落ち着く') {
              ranshin[hatsugenCnt][hatsugenBunCnt][8] = 1
            }
          } else if (hatsugenCnt % 2 === 0) {
            serapitango++
            serapimoji = serapimoji + wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form.length
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === 'そう' && wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt + 1].surface_form === 'です' && wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt + 2].surface_form === 'か') {
              soudesuka++
            }
            if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '何' && wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt + 1].surface_form === 'か') {

            } else if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'いかが' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'なんで' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どうして' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どの' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どのように' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'いつ' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どういう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どなた' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '何' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '誰' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どんな' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どのような' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'どこ') {
              RGBlist[hatsugenCnt / 2][3] = 1
            } else if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === 'か' && wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '助詞') {
              RGBlist[hatsugenCnt / 2][4] = 1
            } else if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === 'ね' && wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '助詞') {
              RGBlist[hatsugenCnt / 2][6] = 1
            }
          }
          aBunContentArr[hatsugenCnt][hatsugenBunCnt] += wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form
          if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos_detail_1 === '接尾' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '*' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '助詞' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '、' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '記号' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '助動詞' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '感動詞' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos === '接頭詞' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos_detail_1 === '非自立' ||
            wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'する' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'いる' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'こういう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'そういう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'こう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'する' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'こうした' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'いう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'する' ||
            wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'なる' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'その' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'あの' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].pos_detail_1 === '数' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'そう' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '気持ち' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '思い' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '思う' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === 'ある') {
            afterMorphologicalAnalysisWordsCnt++
            continue
          }
          aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt] = wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form
          afterMorphologicalAnalysisWordsCnt++
          aBunWordCnt++
        }
        if (hatsugenCnt % 2 === 1) {
          kanjabun++
        } else {
          serapibun++
        }
        if (aBunContentArr[hatsugenCnt][hatsugenBunCnt] === 'Ａ' || aBunContentArr[hatsugenCnt][hatsugenBunCnt] === 'Ｂ' || aBunContentArr[hatsugenCnt][hatsugenBunCnt] === 'Ｔ' || aBunContentArr[hatsugenCnt][hatsugenBunCnt] === 'A' || aBunContentArr[hatsugenCnt][hatsugenBunCnt] === 'B' || aBunContentArr[hatsugenCnt][hatsugenBunCnt] === 'T') {
          aBunContentArr[hatsugenCnt][hatsugenBunCnt] = ''
          continue
        }
        if (aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== 'Ａ' && aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== 'Ｂ' && aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== 'Ｔ' && aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== 'A' && aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== 'B' && aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== 'T' && aBunContentArr[hatsugenCnt][hatsugenBunCnt] !== '') {
          hatsugenArray[hatsugenCnt] += aBunContentArr[hatsugenCnt][hatsugenBunCnt]
          hatsugenArray[hatsugenCnt] += '。'
        }
        if (afterMorphologicalAnalysisWordsCnt === wordsArrayAfterMorphologicalAnalysis.length) {
          if (hatsugenCnt % 2 === 0) {
            if (hatsugenBunCnt <= 2 && aBunWordsQty <= 7) {
              RGBlist[hatsugenCnt / 2][5] = 1
            }
          }
          break
        }
        if (wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].word_id === '2613630' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === '：' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].basic_form === ':' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === '･･･？：' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form === ')：' || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form.indexOf('〈') !== -1 || wordsArrayAfterMorphologicalAnalysis[afterMorphologicalAnalysisWordsCnt].surface_form.indexOf('〉') !== -1) {
          if (hatsugenCnt % 2 === 0) {
            if (hatsugenBunCnt <= 2 && aBunWordsQty <= 7) {
              RGBlist[hatsugenCnt / 2][5] = 1
            }
          }
          afterMorphologicalAnalysisWordsCnt++

          // n++;

          break
        }
        afterMorphologicalAnalysisWordsCnt++
        hatsugenBunCnt++
      }
      hatsugenCnt++
    }
    // console.log("%d 来談者文 %d 単語 %d 文字 %d 治療者文 %d 単語 %d 文字 %d",m,kanjabun,kanjatango,kanjamoji,serapibun,serapitango,serapimoji);
    // console.log("そうですか %d",soudesuka);
    // var uetsuji="うえつじともや";
    // console.log(uetsuji.length);

    var tango = []
    x = 0
    for (let hatsugenCnt = 0; hatsugenCnt < aBunWordArr.length; ++hatsugenCnt) {
      for (let hatsugenBunCnt = 0; hatsugenBunCnt < aBunWordArr[hatsugenCnt].length; ++hatsugenBunCnt) {
        for (let aBunWordCnt = 0; aBunWordCnt < aBunWordArr[hatsugenCnt][hatsugenBunCnt].length; ++aBunWordCnt) {
          tango[x] = aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt]
          x++
        }
      }
    }
    x = 0
    for (let hatsugenCnt = 0; hatsugenCnt < aBunWordArr.length; ++hatsugenCnt) {
      for (let hatsugenBunCnt = 0; hatsugenBunCnt < aBunWordArr[hatsugenCnt].length; ++hatsugenBunCnt) {
        for (let aBunWordCnt = 0; aBunWordCnt < aBunWordArr[hatsugenCnt][hatsugenBunCnt].length; ++aBunWordCnt) {
          y = 0
          if (x > 0) {
            for (z = 0; z < x; z++) {
              if (tango[z] === aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt]) {
                y = 1
                break
              }
            }
          }
          x++
          if (y === 1) {
            continue// 次のjへ
          }
          wordSet.add(aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt])// tangoset終了
        }
      }
    }
    wordSet2 = Array.from(wordSet).map(function (t) { return {t} })

    for (hatsugenBunCnt = 0; hatsugenBunCnt < wordSet2.length; hatsugenBunCnt++) {
      miserables.nodes[hatsugenBunCnt] = wordSet2[hatsugenBunCnt].t
    }
    var RGBk = []
    for (h = 0; h <= 2; h++) {
      RGBk[h] = []
      for (k = 0; k < miserables.nodes.length; k++) {
        RGBk[h][k] = 0
        for (hatsugenCnt = 1; hatsugenCnt < aBunWordArr.length; hatsugenCnt = hatsugenCnt + 2) {
          for (hatsugenBunCnt = 0; hatsugenBunCnt < aBunWordArr[hatsugenCnt].length; hatsugenBunCnt++) {
            if (ansBunCategory[hatsugenCnt][hatsugenBunCnt][h] === 1) {
              for (aBunWordCnt = 0; aBunWordCnt < aBunWordArr[hatsugenCnt][hatsugenBunCnt].length; aBunWordCnt++) {
                if (miserables.nodes[k] === aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt]) {
                  RGBk[h][k] = 1
                  break
                }
              }
            }
            if (RGBk[h][k] === 1) {
              break
            }
          }
          if (RGBk[h][k] === 1) {
            break
          }
        }
      }
    }

    for (h = 0; h <= 2; h++) {
      for (k = 0; k < miserables.nodes.length; k++) {
        if (RGBk[h][k] === 1) {
          for (hatsugenCnt = 1; hatsugenCnt < aBunWordArr.length; hatsugenCnt = hatsugenCnt + 2) {
            for (hatsugenBunCnt = 0; hatsugenBunCnt < aBunWordArr[hatsugenCnt].length; hatsugenBunCnt++) {
              if (ansBunCategory[hatsugenCnt][hatsugenBunCnt][h] === 0) {
                for (aBunWordCnt = 0; aBunWordCnt < aBunWordArr[hatsugenCnt][hatsugenBunCnt].length; aBunWordCnt++) {
                  if (miserables.nodes[k] === aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt]) {
                    ansBunCategory[hatsugenCnt][hatsugenBunCnt][h] = 1
                    break
                  }
                }
              }
            }
          }
        }
      }
    }

    var storage = localStorage// 初回読み込み

    var graph

    console.log(aBunContentArr)

    var sResult = select(name, storage, checkboxlist, aBunWordArr, miserables, chboxlist, chboxlist2, ansBunCategory, RGBlist, hatsugenArray, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2)

    checkboxlist = sResult.checkboxlist
    chboxlist = sResult.chboxlist
    chboxlist2 = sResult.chboxlist2
    ansBunCategory = sResult.RGB
    RGBlist = sResult.RGBlist
    ansRadioResult = sResult.checked
    checked2 = sResult.checked2
    taiou = sResult.taiou
    taiou2 = sResult.taiou2
    chboxlength = sResult.chboxlength
    chboxlength2 = sResult.chboxlength2
    console.log(chboxlength2)
    var answerNumbermax = sResult.answerNumbermax
    var questionNumbermax = sResult.questionNumbermax

    // graph = sResult.graph;
    // console.log("chboxlength2=%d",chboxlength2)

    let setForVizInput = {
      name: name,
      storage: storage,
      wordArrayInASentence: aBunWordArr,
      chboxlist: chboxlist,
      chboxlist2: chboxlist2,
      RGBlist: RGBlist,
      hatsugenArray: hatsugenArray,
      contentArrayOfASentence: aBunContentArr,
      checked: ansRadioResult,
      checked2: checked2,
      taiou: taiou,
      taiou2: taiou2,
      chboxlength: chboxlength,
      chboxlength2: chboxlength2,
      startTime: startTime,
      graph: graph,
      ranshin: ranshin,
      zoom_value: zoomVal
    }

    setForViz(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArray, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal)

    // 以下は後ろじゃなきゃアカン
    for (let c = 1; c <= chboxlength; c++) {
      makeOnClick(c)
    }
    for (let c = 1; c <= chboxlength2; c++) {
      makeOnClickS(c)
    }

    //selectGraphShape(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArray, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, visResult, setForVizInput)

    // graphの形状を切り替えた際もここで再描画される

    document.getElementById('radio_buttons').onchange = () => {
      setForViz(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArray, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal)
    }

    // スライダー
    $('#slider1').slider()
    $('#slider1').on('slide', function (slideEvt) {
      $('#SliderVal').text(slideEvt.value)
      zoomVal = slideEvt.value
      setForViz(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArray, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal)
    })

    return {
      name: name, RGBlist: RGBlist, keitaisokaiseki: aBunWordArr, hatsugen: hatsugenArray, bun: aBunContentArr, chboxlist: chboxlist, chboxlist2: chboxlist2, checked: ansRadioResult, checked2: checked2, taiou: taiou, taiou2: taiou2, chboxlength: chboxlength, chboxlength2: chboxlength2
    }
  })
}

const isLoveWord = (query) => {
  if (loveDictionaryArray.indexOf(query)) {
    return true
  }
  return false
}

export {classifyWithFirstWordDictionary}
