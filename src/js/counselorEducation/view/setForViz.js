import d3 from 'd3'
import {viz} from './viz'
import { rodata } from '../rodata'

const answerRadioFullLength=5

const openColor = rodata.color.open
const closeColor = rodata.color.close
const aiduchiColor = rodata.color.aiduchiColor
const sekenColor = '#2c3e50'
const kaishakuColor = '#f1c400'

const setForViz = (name, storage, keitaisokaiseki, chboxlist, chboxlist2, RGBlist, hatsugen, bun, answerRadioResult, questionRadioResult, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoomVal) => {
  let isUsingDictionaryWithWord2Vec = 0

  var bunsuu = 2// 前後の余白
  for (let m = 1; m < hatsugen.length; m = m + 2) { // 患者の発言で間隔を作る
    bunsuu = bunsuu + hatsugen[m].length
  }
  var width = zoomVal * bunsuu

  let graphNumber = 2

  d3.select('#svgdiv').select('svg').remove()
  var svg = d3.select('#svgdiv').append('svg')
    .attr('height', 270)
    .attr('width', width)
  var allQuestionHatsugenColorArr = []
  var stackDataArr = []
  if (chboxlength >= 1) {
    readAnswerRadio(name, storage, chboxlist, answerRadioResult, taiou, chboxlength, isUsingDictionaryWithWord2Vec)
  }
  if (chboxlength2 >= 1) {
    readQuestionRadio(name, storage, chboxlist, chboxlist2, questionRadioResult, taiou, taiou2, chboxlength, chboxlength2)
  }

  let h, i, c, m, n

  for (let n = 0; n < RGBlist.length; n++) {
    RGBlist[n][0] = 0
    RGBlist[n][1] = 0
    RGBlist[n][2] = 0
  }

  let ansCategoryNumArr = []
  n = 0// m=1;m<keitaisokaiseki.length;m=m+2の外
  for (let m = 1; m < keitaisokaiseki.length; m = m + 2) {
    ansCategoryNumArr[m] = []// svgでの描画ではm→i
    for (let i = 0; i < keitaisokaiseki[m].length; i++) {
      ansCategoryNumArr[m][i] = 0
      for (let c = 1; c < chboxlist.length; c++) {
        if (bun[m][i] === chboxlist[c][0]) {
          if (answerRadioResult[c - 1] === 1) {
            RGBlist[n][0] = RGBlist[n][0] + 1
            ansCategoryNumArr[m][i] = 1
          } else if (answerRadioResult[c - 1] === 2) {
            RGBlist[n][1] = RGBlist[n][1] + 1
            ansCategoryNumArr[m][i] = 2
          } else if (answerRadioResult[c - 1] === 3) {
            RGBlist[n][2] = RGBlist[n][2] + 1
            ansCategoryNumArr[m][i] = 3
          } else if (answerRadioResult[c - 1] === 4) {
            RGBlist[n][3] = RGBlist[n][3] + 1
            ansCategoryNumArr[m][i] = 4
          } else if (answerRadioResult[c - 1] === 5) {
            RGBlist[n][4] = RGBlist[n][4] + 1
            ansCategoryNumArr[m][i] = 5
          }
        }
      }
    }
    n++
  }

  let allQuestionHatsugenCategoryArr=[]
  for (let c = 0; c < questionRadioResult.length; c++) {
    if (questionRadioResult[c] === 3) {
      allQuestionHatsugenColorArr[c] = openColor
    } else if (questionRadioResult[c] === 5) {
      allQuestionHatsugenColorArr[c] = aiduchiColor
    } else if (questionRadioResult[c] === 4) {
      allQuestionHatsugenColorArr[c] = closeColor
    } else if (questionRadioResult[c] === 6) {
      allQuestionHatsugenColorArr[c] = kaishakuColor
    } else {
      allQuestionHatsugenColorArr[c] = sekenColor
    }
  }

  let RGBmax = []
  let RGBmaxmax = 1

  for (let m = 0; m < ((keitaisokaiseki.length - 1) / 2); m++) {
    // 2個飛ばしにしたら後が面倒くさい。患者 1→0,3→1,長さ9なら番号は8まで
    RGBmax[m] = 1
    for (h = 0; h < 3; h++) {
      RGBmax[m] = RGBmax[m] + RGBlist[m][h]
    }
    if (RGBmaxmax < RGBmax[m]) {
      RGBmaxmax = RGBmax[m]
    }
  }

  //graph = loadChartSelect()

  for (h = 0; h < 3; h++) {
    stackDataArr[h] = []
    for (m = 0; m < ((keitaisokaiseki.length - 1) / 2); m++) {
      stackDataArr[h][3 * m] = new Object()
      if (graph === 2) {
        stackDataArr[h][3 * m] = {x: 3 * m + 1, y: 0}
      } else {
        stackDataArr[h][3 * m] = {x: 3 * m + 1, y: (5 * (RGBlist[m][h]) / RGBmaxmax)}
      }

      stackDataArr[h][3 * m + 1] = new Object()
      stackDataArr[h][3 * m + 1] = {x: 3 * m + 2, y: (5 * (RGBlist[m][h]) / RGBmaxmax)}
      stackDataArr[h][3 * m + 2] = new Object()
      stackDataArr[h][3 * m + 2] = {x: 3 * m + 3, y: 0}
    }
  }
  viz(stackDataArr, allQuestionHatsugenColorArr, bun, hatsugen, svg, ansCategoryNumArr, keitaisokaiseki, RGBmaxmax, startTime, graph, answerRadioResult, ranshin, width, bunsuu)
  return {
    chboxlist: chboxlist,
    chboxlist2: chboxlist2,
    RGBlist: RGBlist,
    checked: answerRadioResult,
    checked2: questionRadioResult,
    chboxlength: chboxlength,
    chboxlength2: chboxlength2,
    ranshin: ranshin
  }
}

const readAnswerRadio = (jsonFileName, storage, chboxlist, answerRadioResult, taiou, chboxlength, isUsingDictionaryWithWord2Vec) => {
  let chartId = 2

  var c
  for (c = 1; c <= chboxlength; c++) {
    let changedAnswerClassificationSaveTarget

    if (isUsingDictionaryWithWord2Vec === 1) {
      changedAnswerClassificationSaveTarget = jsonFileName + 'AnswerWithNewDictionary' + c
      // 今後辞書名に対応
    } else {
      changedAnswerClassificationSaveTarget = jsonFileName + 'RGB' + c
    }

    const answerRadio = document.getElementById('r' + c).children
    for (let i = answerRadio.length - answerRadioFullLength, l = answerRadio.length; i < l; i++) {
      if (answerRadio[i].control.checked === true) {
        if (answerRadio[i].control.value === '1') {
          answerRadioResult[taiou[c - 1]] = 1
          storage.setItem(changedAnswerClassificationSaveTarget, 0)
          break
        } else if (answerRadio[i].control.value === '2') {
          answerRadioResult[taiou[c - 1]] = 2
          storage.setItem(changedAnswerClassificationSaveTarget, 1)
          break
        } else if (answerRadio[i].control.value === '3') {
          answerRadioResult[taiou[c - 1]] = 3
          storage.setItem(changedAnswerClassificationSaveTarget, 2)
          break
        }else if (answerRadio[i].control.value === '4') {
          answerRadioResult[taiou[c - 1]] = 4
          storage.setItem(changedAnswerClassificationSaveTarget, 3)
          break
        }else if (answerRadio[i].control.value === '5') {
          answerRadioResult[taiou[c - 1]] = 5
          storage.setItem(changedAnswerClassificationSaveTarget, 4)
          break
        }
      } else {
        answerRadioResult[taiou[c - 1]] = 0
        storage.setItem(changedAnswerClassificationSaveTarget, 9)// 未分類
      }
    }
  }
}

const readQuestionRadio = (name, storage, chboxlist, chboxlist2, questionRadioResult, taiou, taiou2, chboxlength, chboxlength2) => {
  let c

  let black = 0
  for (let c = 1; c <= chboxlength2; c++) {
    const radio = document.getElementById('rs' + c).children
    for (let i = radio.length - 5, l = radio.length; i < l; i++) {
      if (radio[i].control.checked === true) {
        // storage.getItem(name+"RGBlist"+m)=
        if (radio[i].control.value === '3') {
          questionRadioResult[taiou[c - 1]] = 3
          storage.setItem(name + 'RGBlist' + c, 3)
          break
        }
        if (radio[i].control.value === '4') {
          questionRadioResult[c - 1] = 4
          storage.setItem(name + 'RGBlist' + c, 4)
          break
        }
        if (radio[i].control.value === '5') {
          questionRadioResult[c - 1] = 5
          storage.setItem(name + 'RGBlist' + c, 5)
          break
        }
        if (radio[i].control.value === '6') {
          questionRadioResult[c - 1] = 6
          storage.setItem(name + 'RGBlist' + c, 6)
          break
        }
      } else {
        questionRadioResult[c - 1] = 7
        storage.setItem(name + 'RGBlist' + c, 7)
      }
    }
    if (questionRadioResult[c - 1] === 7) {
      black++
    }
  }
}

export {setForViz}