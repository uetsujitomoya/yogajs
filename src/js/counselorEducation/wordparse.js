import 'kuromoji'
import $ from 'jquery'
import {select} from './select.js'
import {setForViz} from './setForViz'
import {slider} from 'bootstrap-slider'
import { isEOHatsugen } from './wordparse/isEOHatsugen'
import { barChartRodata } from './rodata'

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

const classifyWithFirstWordDictionary = (name, aBunWordArr, checkboxlist, chboxlist, chboxlist2, RGBlist, hatsugenArr, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, originalText) => {
  let jsonName = '160803dummy'
  var startTime = new Date()
  console.log(startTime)

  var ansCateNo, hatsugenBunCnt, aBunWordCnt, k, hatsugenCnt, afterMorphologicalAnalysisWordsCnt, c, x, y, z
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
    const morphologicalAnalysisWordsArr = tokenizer.tokenize(originalText)

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
    while (afterMorphologicalAnalysisWordsCnt < morphologicalAnalysisWordsArr.length) {
      aBunWordArr[hatsugenCnt] = []
      aBunContentArr[hatsugenCnt] = []//安易に足していいのか？
      hatsugenArr[hatsugenCnt] = ''
      hinshi[hatsugenCnt] = []
      ansBunCategory[hatsugenCnt] = []
      ranshin[hatsugenCnt] = []
      if (hatsugenCnt % 2 === 0) {
        RGBlist[hatsugenCnt / 2] = [0, 0, 0, 0, 0, 0, 0, 0]
      }
      hatsugenBunCnt = 0
      aBunWordsQty = 0
      while (afterMorphologicalAnalysisWordsCnt < morphologicalAnalysisWordsArr.length) {
        aBunWordArr[hatsugenCnt][hatsugenBunCnt] = []
        aBunContentArr[hatsugenCnt][hatsugenBunCnt] = ''//安易に足していいのか？
        hinshi[hatsugenCnt][hatsugenBunCnt] = []
        aBunWordArr[hatsugenCnt][hatsugenBunCnt].length = 0
        ansBunCategory[hatsugenCnt][hatsugenBunCnt] = [0, 0, 0]
        ranshin[hatsugenCnt][hatsugenBunCnt] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        aBunWordCnt = 0
        while (afterMorphologicalAnalysisWordsCnt < morphologicalAnalysisWordsArr.length) {
          aBunWordsQty++

          if (isEOHatsugen(morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt])) {
            break
          }
          if (hatsugenCnt % 2 === 1) {
            kanjatango++
            kanjamoji = kanjamoji + morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form.length
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '母' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '主人' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '父さん' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'ご主人' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'お父さん' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '姉' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '姉さん' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '母親' ||
              morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'お姉さん' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '父' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '家族') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '兄' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '子' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '子ども' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '妹' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '弟') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '両親' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'お母様' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'お父様') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '仕事' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '休み' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'アルバイト' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '働く' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '同僚' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '職場' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '上司' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '部下') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][2] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '友人' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '親友' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '友達' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '友' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '交友' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '友好') {
              ansBunCategory[hatsugenCnt][hatsugenBunCnt][1] = 1
            }

            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '病' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '病気' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'ストレス' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '不調' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '過食' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '嘔吐' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '過食嘔吐') {
              ranshin[hatsugenCnt][hatsugenBunCnt][0] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '無気力' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '気力' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'やる気') {
              ranshin[hatsugenCnt][hatsugenBunCnt][1] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '疑い' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '疑う' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '疑心暗鬼' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '疑心') {
              ranshin[hatsugenCnt][hatsugenBunCnt][2] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '注意' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '不注意' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '注意散漫' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '無自覚' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '自覚') {
              ranshin[hatsugenCnt][hatsugenBunCnt][3] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '引き延ばし' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '引き延ばす' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '怠慢' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '怠惰') {
              ranshin[hatsugenCnt][hatsugenBunCnt][4] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '渇望' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '切望' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '欲しい') {
              ranshin[hatsugenCnt][hatsugenBunCnt][5] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '妄想' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '空想' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '想い' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'ふける') {
              ranshin[hatsugenCnt][hatsugenBunCnt][6] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '抜け出す' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '打破' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '勝つ' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '戦う') {
              ranshin[hatsugenCnt][hatsugenBunCnt][7] = 1
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '不安定' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '安定' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '落ち着く') {
              ranshin[hatsugenCnt][hatsugenBunCnt][8] = 1
            }
          } else if (hatsugenCnt % 2 === 0) {
            serapitango++
            serapimoji = serapimoji + morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form.length
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === 'そう' && morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt + 1].surface_form === 'です' && morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt + 2].surface_form === 'か') {
              soudesuka++
            }
            if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === '何' && morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt + 1].surface_form === 'か') {

            } else if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'いかが' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'なんで' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どうして' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どの' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どのように' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'いつ' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どういう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どなた' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === '何' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '誰' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どんな' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どのような' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'どこ') {
              RGBlist[hatsugenCnt / 2][3] = 1
            } else if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === 'か' && morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '助詞') {
              RGBlist[hatsugenCnt / 2][4] = 1
            } else if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === 'ね' && morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '助詞') {
              RGBlist[hatsugenCnt / 2][6] = 1
            }
          }
          aBunContentArr[hatsugenCnt][hatsugenBunCnt] += morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form
          if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos_detail_1 === '接尾' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '*' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '助詞' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '、' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '記号' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '助動詞' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '感動詞' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos === '接頭詞' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos_detail_1 === '非自立' ||
            morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'する' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'いる' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'こういう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'そういう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'こう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'する' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'こうした' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'いう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'する' ||
            morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'なる' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'その' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'あの' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].pos_detail_1 === '数' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'そう' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '気持ち' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '思い' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '思う' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === 'ある') {
            afterMorphologicalAnalysisWordsCnt++
            continue
          }
          aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt] = morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form
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
          hatsugenArr[hatsugenCnt] += aBunContentArr[hatsugenCnt][hatsugenBunCnt]
          hatsugenArr[hatsugenCnt] += '。'
        }
        if (afterMorphologicalAnalysisWordsCnt === morphologicalAnalysisWordsArr.length) {
          if (hatsugenCnt % 2 === 0) {
            if (hatsugenBunCnt <= 2 && aBunWordsQty <= 7) {
              RGBlist[hatsugenCnt / 2][5] = 1
            }
          }
          deleteEmptyString(aBunContentArr[hatsugenCnt],hatsugenBunCnt)
          console.log(aBunContentArr[hatsugenCnt])
          break
        }
        if (morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].word_id === '2613630' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === '：' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].basic_form === ':' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === '･･･？：' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form === ')：' || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form.indexOf('〈') !== -1 || morphologicalAnalysisWordsArr[afterMorphologicalAnalysisWordsCnt].surface_form.indexOf('〉') !== -1) {
          if (hatsugenCnt % 2 === 0) {
            if (hatsugenBunCnt <= 2 && aBunWordsQty <= 7) {
              RGBlist[hatsugenCnt / 2][5] = 1
            }
          }
          afterMorphologicalAnalysisWordsCnt++

          // n++;
          deleteEmptyString(aBunContentArr[hatsugenCnt],hatsugenBunCnt)
          console.log(aBunContentArr[hatsugenCnt])

          break
        }
        afterMorphologicalAnalysisWordsCnt++

        //空白文字列を防ぐ

        if(aBunContentArr[hatsugenCnt][hatsugenBunCnt]===""){
          aBunContentArr[hatsugenCnt].pop()
        }else{
          hatsugenBunCnt++
        }

      }
/*      //最初の空白を防ぐ
      if(aBunContentArr[hatsugenCnt][0]===""){
        aBunContentArr[hatsugenCnt].shift()
      }*/
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
    for (ansCateNo = 0; ansCateNo < barChartRodata.ansCateQty; ansCateNo++) {
      RGBk[ansCateNo] = []
      for (k = 0; k < miserables.nodes.length; k++) {
        RGBk[ansCateNo][k] = 0
        for (hatsugenCnt = 1; hatsugenCnt < aBunWordArr.length; hatsugenCnt = hatsugenCnt + 2) {
          for (hatsugenBunCnt = 0; hatsugenBunCnt < aBunWordArr[hatsugenCnt].length; hatsugenBunCnt++) {
            if (ansBunCategory[hatsugenCnt][hatsugenBunCnt][ansCateNo] === 1) {
              for (aBunWordCnt = 0; aBunWordCnt < aBunWordArr[hatsugenCnt][hatsugenBunCnt].length; aBunWordCnt++) {
                if (miserables.nodes[k] === aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt]) {
                  RGBk[ansCateNo][k] = 1
                  break
                }
              }
            }
            if (RGBk[ansCateNo][k] === 1) {
              break
            }
          }
          if (RGBk[ansCateNo][k] === 1) {
            break
          }
        }
      }
    }

    for (ansCateNo = 0; ansCateNo < barChartRodata.ansCateQty; ansCateNo++) {
      for (k = 0; k < miserables.nodes.length; k++) {
        if (RGBk[ansCateNo][k] === 1) {
          for (hatsugenCnt = 1; hatsugenCnt < aBunWordArr.length; hatsugenCnt = hatsugenCnt + 2) {
            for (hatsugenBunCnt = 0; hatsugenBunCnt < aBunWordArr[hatsugenCnt].length; hatsugenBunCnt++) {
              if (ansBunCategory[hatsugenCnt][hatsugenBunCnt][ansCateNo] === 0) {
                for (aBunWordCnt = 0; aBunWordCnt < aBunWordArr[hatsugenCnt][hatsugenBunCnt].length; aBunWordCnt++) {
                  if (miserables.nodes[k] === aBunWordArr[hatsugenCnt][hatsugenBunCnt][aBunWordCnt]) {
                    ansBunCategory[hatsugenCnt][hatsugenBunCnt][ansCateNo] = 1
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

    console.log("bun")
    console.log(aBunContentArr)

    var selectResult = select(name, storage, checkboxlist, aBunWordArr, miserables, chboxlist, chboxlist2, ansBunCategory, RGBlist, hatsugenArr, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2)

    checkboxlist = selectResult.checkboxlist
    chboxlist = selectResult.chboxlist
    chboxlist2 = selectResult.chboxlist2
    ansBunCategory = selectResult.RGB
    RGBlist = selectResult.RGBlist
    ansRadioResult = selectResult.checked
    checked2 = selectResult.checked2
    taiou = selectResult.taiou
    taiou2 = selectResult.taiou2
    chboxlength = selectResult.chboxlength
    chboxlength2 = selectResult.chboxlength2
    console.log(chboxlength2)
    var answerNumbermax = selectResult.answerNumbermax
    var questionNumbermax = selectResult.questionNumbermax

    // graph = selectResult.graph;
    // console.log("chboxlength2=%d",chboxlength2)

    let setForVizInput = {
      name: name,
      storage: storage,
      wordArrayInASentence: aBunWordArr,
      chboxlist: chboxlist,
      chboxlist2: chboxlist2,
      RGBlist: RGBlist,
      hatsugenArray: hatsugenArr,
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

    setForViz(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArr, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal)

    // 以下は後ろじゃなきゃアカン
    for (let c = 1; c <= chboxlength; c++) {
      makeOnClick(c)
    }
    for (let c = 1; c <= chboxlength2; c++) {
      makeOnClickS(c)
    }

    //selectGraphShape(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArr, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, visResult, setForVizInput)

    // graphの形状を切り替えた際もここで再描画される

    document.getElementById('radio_buttons').onchange = () => {
      setForViz(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArr, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal)
    }

    // スライダー
    $('#slider1').slider()
    $('#slider1').on('slide', function (slideEvt) {
      $('#SliderVal').text(slideEvt.value)
      zoomVal = slideEvt.value
      setForViz(name, storage, aBunWordArr, chboxlist, chboxlist2, RGBlist, hatsugenArr, aBunContentArr, ansRadioResult, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal)
    })

    return {
      name: name, RGBlist: RGBlist, keitaisokaiseki: aBunWordArr, hatsugen: hatsugenArr, bun: aBunContentArr, chboxlist: chboxlist, chboxlist2: chboxlist2, checked: ansRadioResult, checked2: checked2, taiou: taiou, taiou2: taiou2, chboxlength: chboxlength, chboxlength2: chboxlength2
    }
  })
}

const isLoveWord = (query) => {
  if (loveDictionaryArray.indexOf(query)) {
    return true
  }
  return false
}

const deleteEmptyString = (arr,hatsugenBunCnt) => {
/*  if(arr[hatsugenBunCnt]===""){
    arr.pop()
  }*/
  if(arr[arr.length-1]===""){
    arr.pop()
  }
}

export {classifyWithFirstWordDictionary}
