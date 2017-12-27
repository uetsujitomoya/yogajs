// <コンパイル方法>
// yogajsまで移動
// npm run build でコンパイル

import d3 from 'd3'
import textures from 'textures'
import {rodata} from '../rodata'
import { viewOnlyTxt } from './viewOnlyTxt'
import { viewBarChart } from './viewBarChart'
import { viewStackChart } from './viewStackChart'

// let love="#ffeeff";
// let friend="#c0ffc0";
// let work="#a0e0ff";

const loveColor = '#ffaaff'
const friendColor = '#a0ffa0'
const workColor = '#90c0ff'
const answerTextureColor={
  self:'#ffd700',
  spiritual:'#9370db'
}
const barChartBackgroundColor = '#f9f9f9'

const loveBGColor = '#ffeeff'
const friendBGColor = '#c0ffc0'
const workBGColor = '#a0e0ff'

const answerBGColor={
  self:'#f0e68c',
  spiritual:'#ba79b1'
}


const loveTexture=textures.paths()
  .d('waves')
  .thicker()
  .stroke(loveColor)
  .background(loveBGColor)
const friendTexture= textures.lines()
  .orientation('3/8')
  .stroke(friendColor)
  .background(friendBGColor)
const workTexture= textures.lines()
  .orientation('vertical', 'horizontal')
  .size(4)
  .strokeWidth(1)
  .shapeRendering('crispEdges')
  .stroke(workColor)
  .background(workBGColor)
const selfTexture = textures.paths()
  .d('caps')
  .lighter()
  .thicker()
  .stroke('darkorange')
  .background(answerBGColor.self)
const spiritualTexture = textures.paths()
  .d('woven')
  .lighter()
  .thicker()
  .background(answerBGColor.spiritual)
const noCategoryAnswerColor= '#c0c0c0'


const categoryOfTextOnRect={
  openQuestion: '開 質問',
  feedback:'相槌',
  closedQuestion:'閉 質問',
  interpretation:'解釈',
  noGroup:'未',
  love:'愛',
  friendship:'交友',
  work:'仕事',
  self:'自己',
  spiritual:"スピリチュアル",
  smallTalk: '世間話'
}

const fontSizeInTextView = rodata.textViewFontSize

let vizPart = (talker, task, orijinalSentence) => {
  let box = (talker, task, orijinalSentence) => {
    // this.viz=;
  }

  let boxArray = []
}

let originalSentencePart = (talker, task, orijinBun) => {
  let sentenceViz = (talker, task, orijinBun) => {
    // this.viz=;
  }
  let bunVizArr = []
}

const addTextToSVG = (x, y, text) => {
  d3.select('svg')
    .append('text')
    .attr({
      x: x,
      y: y
    })
    .text(text)
}



const height0 = 200
const height = 200

const viz = (stackDataArr, allQuestionHatsugenColorArr, bun2dArr, hatsugenArr, svg, ansCategoryNoArr, keitaisokaiseki, RGBmaxmax, startTime, graphTypeNum, checked, ranshin, width, bunsuu) => {
  const upperName = 'カウンセラー'
  const lowerName = 'クライエント'
  const txtViewCounselor = '<img src = "./picture/counselor2.jpg" width ="20">'
  const txtViewClient = '<img src = "./picture/client.jpg" width ="17">'


  let m

  var nagasa = []// 縦棒の位置
  nagasa[0] = 1 * width / (bunsuu + 1)
  for (m = 1; m < hatsugenArr.length; m = m + 2) {
    nagasa[(m + 1) / 2] = nagasa[-1 + (m + 1) / 2] + hatsugenArr[m].length * width / bunsuu
  }

  var margin2 = {top: 10, right: 10, bottom: 50, left: 40}

  //var colorBun = ['#c0c0c0', loveColor, friendColor, workColor]
  const ansTextureChoiceArr = [noCategoryAnswerColor, loveColor, friendColor, workColor, rodata.color.self.t, rodata.color.spiritual.t]

  //defined answerTextureChoiceArr finish

  const axisDescriptionY = 240

  if (graphTypeNum !== 1) {
    const axisDescription = '横軸の単位：全ての発言の全ての文字数'

    let graphShiftX = 58
    let axisShiftX = 68

    var barLenQtyArr = []// 区分
    var mazekoze = []// カウンセラーを発言毎に、クライエントを文ごとに収録
    var isFullConversationAnswerArr = []// カウンセラーなら0

    let barChartAllHatsugenColorArr = []
    let barChartAllHatsugenCategoryArr=[]

    let allHatsugenNoArr = []
    let h = 0
    let ranshinStrArr = []
    // 初手カウンセラー
    barLenQtyArr[0] = hatsugenArr[0].length * width / bunsuu
    mazekoze[0] = hatsugenArr[0]
    isFullConversationAnswerArr[0] = 0
    barChartAllHatsugenColorArr[0] = allQuestionHatsugenColorArr[0]
    barChartAllHatsugenCategoryArr[0] =
      allHatsugenNoArr[0] = 0

    let c = 0

    for (let hatsugenNo = 1; hatsugenNo < hatsugenArr.length; hatsugenNo = hatsugenNo + 2) {
      h++
      // クライエント
      bun2dArr[hatsugenNo].forEach((d) => {
        if (d !== '') {
          barLenQtyArr[h] = d.length * width / bunsuu
          mazekoze[h] = d
          isFullConversationAnswerArr[h] = 1
          barChartAllHatsugenColorArr[h] = ansTextureChoiceArr[checked[c]]
          allHatsugenNoArr[h] = hatsugenNo
          h++
          c++
        }
      })
      if (hatsugenNo + 1 === hatsugenArr.length) {
        break
      }
      // カウンセラー
      barLenQtyArr[h] = hatsugenArr[hatsugenNo + 1].length * width / bunsuu
      mazekoze[h] = hatsugenArr[hatsugenNo + 1]
      isFullConversationAnswerArr[h] = 0
      barChartAllHatsugenColorArr[h] = allQuestionHatsugenColorArr[(hatsugenNo + 1) / 2]
      allHatsugenNoArr[h] = hatsugenNo + 1
    }

    //allHatsugenNoArr setting finish

    if(rodata.isOnlyTxt){
      let onlyTxtTarget = document.getElementById('msg')
      viewOnlyTxt(onlyTxtTarget,hatsugenArr,allHatsugenNoArr,bun2dArr,ansTextureChoiceArr,ansCategoryNoArr,allQuestionHatsugenColorArr)
    }else{
      viewBarChart
    }
  } else {
    viewStackChart
  }
}

const createCircleWithTexture = () => { // example
  var svg = d3.select('#example')
    .append('svg')

  var t = textures.lines()
    .thicker()

  svg.call(t)

  svg.append('circle')
    .style('fill', t.url())
}

const loadChartSelect=()=>{
  const radio = document.getElementById('graph').children
  for (let i = 0; i <= graphNumber - 1; i++) {
    if (radio[i].control.checked === true) {
      if (radio[i].control.value === '13') {
        return 3
      } else {
        return 1
      }
    }
  }
}

export {viz}
