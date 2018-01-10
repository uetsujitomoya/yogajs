import d3 from 'd3'
import { fromAnsRadioResultToAnsCateNum } from './setForViz/fromAnsRadioResultToAnsCateNum'
import { readAnsRadio } from './setForViz/readAnsRadio'
import { readQueRadio } from './setForViz/readQueRadio'
import {rodata} from './rodata'
import {viz} from './viz'

const setForViz = (name, storage, keitaisokaiseki, ansBunAnd1stCateArr, queBunAnd1stCateArr, RGBlist, hatsugen, bun, ansRadioResult, queRadioResult, taiou, taiou2, ansChBoxLen, queChBoxLen, startTime, graph, ranshin, zoomVal) => {
  let isUsingDictionaryWithWord2Vec = 0

  var bunsuu = 2// 前後の余白
  for (let hatsugenNo = 1; hatsugenNo < hatsugen.length; hatsugenNo = hatsugenNo + 2) { // 患者の発言で間隔を作る
    bunsuu = bunsuu + hatsugen[hatsugenNo].length
  }
  var width = zoomVal * bunsuu

  let graphNumber = 2

  d3.select('#svgdiv').select('svg').remove()
  var svg = d3.select('#svgdiv').append('svg')
    .attr('height', 270)
    .attr('width', width)
  var allQueHatsugenColorArr = []
  var stackDataArr = []
  if (ansChBoxLen >= 1) {
    readAnsRadio(name, storage, ansBunAnd1stCateArr, ansRadioResult, taiou, ansChBoxLen, isUsingDictionaryWithWord2Vec)
  }
  if (queChBoxLen >= 1) {
    readQueRadio(name, storage, ansBunAnd1stCateArr, queBunAnd1stCateArr, queRadioResult, taiou, taiou2, ansChBoxLen, queChBoxLen)
  }

  let h, i, c, m, n

  for (let n = 0; n < RGBlist.length; n++) {
    RGBlist[n][0] = 0
    RGBlist[n][1] = 0
    RGBlist[n][2] = 0
  }

  console.log(ansRadioResult)

  let ansCateNumArr = []
  fromAnsRadioResultToAnsCateNum(ansCateNumArr,ansRadioResult,keitaisokaiseki,ansBunAnd1stCateArr,RGBlist,bun)

  console.log(ansCateNumArr)

  for (let queHatsugenNo = 0; queHatsugenNo < queRadioResult.length; queHatsugenNo++) {
    if (queRadioResult[queHatsugenNo] === 3) {
      allQueHatsugenColorArr[queHatsugenNo] = rodata.color.open
    } else if (queRadioResult[queHatsugenNo] === 5) {
      allQueHatsugenColorArr[queHatsugenNo] = rodata.color.aiduchi
    } else if (queRadioResult[queHatsugenNo] === 4) {
      allQueHatsugenColorArr[queHatsugenNo] = rodata.color.close
    } else if (queRadioResult[queHatsugenNo] === 6) {
      allQueHatsugenColorArr[queHatsugenNo] = rodata.color.kaishaku
    } else {
      allQueHatsugenColorArr[queHatsugenNo] = rodata.color.seken
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
  viz(stackDataArr, allQueHatsugenColorArr, bun, hatsugen, svg, ansCateNumArr, keitaisokaiseki, RGBmaxmax, startTime, graph, ansRadioResult, ranshin, width, bunsuu)
  return {
    chboxlist: ansBunAnd1stCateArr,
    chboxlist2: queBunAnd1stCateArr,
    RGBlist: RGBlist,
    checked: ansRadioResult,
    checked2: queRadioResult,
    chboxlength: ansChBoxLen,
    chboxlength2: queChBoxLen,
    ranshin: ranshin
  }
}

export {setForViz}