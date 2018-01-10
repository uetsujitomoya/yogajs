// <コンパイル方法>
// yogajsまで移動
// npm run build でコンパイル

import d3 from 'd3'
import textures from 'textures'
import {rodata} from './rodata'
import { fromAnsRadioResultToAnsCateNum } from './setForViz/fromAnsRadioResultToAnsCateNum'
import { readAnsRadio } from './setForViz/readAnsRadio'
import { vizStackChart } from './viz/vizStackChart'

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

const openColor = rodata.color.open
const closeColor = rodata.color.close
const aiduchiColor = rodata.color.aiduchi
const sekenColor = rodata.color.seken
const kaishakuColor = rodata.color.kaishaku

const height0 = 200
const height = 200

const viz = (stackdataArr, colorArrayInAllQuestionHatsugen, bun, hatsugen, svg, ansCategoryNumArr, keitaisokaiseki, RGBmaxmax, startTime, graphTypeNum, ansRadioResult, ranshin, width, bunsuu) => {

  //console.log(ansRadioResult)
  const upperName = 'カウンセラー'
  const lowerName = 'クライエント'
  const txtViewCounselor = '<img src = "./picture/counselor2.jpg" width ="20">'
  const clientInTextView = '<img src = "./picture/client.jpg" width ="17">'

  let m

  var nagasa = []// 縦棒の位置
  nagasa[0] = 1 * width / (bunsuu + 1)
  for (m = 1; m < hatsugen.length; m = m + 2) {
    nagasa[(m + 1) / 2] = nagasa[-1 + (m + 1) / 2] + hatsugen[m].length * width / bunsuu
  }

  var margin2 = {top: 10, right: 10, bottom: 50, left: 40}

  //var colorBun = ['#c0c0c0', loveColor, friendColor, workColor]
  const answerTextureChoiceArr = [noCategoryAnswerColor, loveColor, friendColor, workColor, rodata.color.self.t, rodata.color.spiritual.t]

  const axisDescriptionY = 240

  if (graphTypeNum !== 1) {
    const axisDescription = '横軸の単位：全ての発言の全ての文字数'

    let graphShiftX = 58
    let axisShiftX = 68

    var len2 = []// 区分
    var mazekoze = []// カウンセラーを発言毎に、クライエントを文ごとに収録
    var isFullConversationAnswerArr = []// カウンセラーなら0

    let barChartAllHatsugenColorArr = []
    let barChartAllHatsugenCategoryArr=[]

    let rectHatsugenNoArr = []
    let h = 0
    let mazekozeRanshinArr = []
    // 初手カウンセラー
    len2[0] = hatsugen[0].length * width / bunsuu
    mazekoze[0] = hatsugen[0]
    isFullConversationAnswerArr[0] = 0
    barChartAllHatsugenColorArr[0] = colorArrayInAllQuestionHatsugen[0]
    barChartAllHatsugenCategoryArr[0] =
      rectHatsugenNoArr[0] = 0

    let c = 0

    for (m = 1; m < hatsugen.length; m = m + 2) {
      h++
      // クライエント
      bun[m].forEach((d) => {
        if (d !== '') {
          len2[h] = d.length * width / bunsuu
          mazekoze[h] = d
          isFullConversationAnswerArr[h] = 1
          barChartAllHatsugenColorArr[h] = answerTextureChoiceArr[ansRadioResult[c]]
          rectHatsugenNoArr[h] = m
          h++
          c++
        }
      })
      if (m + 1 === hatsugen.length) {
        break
      }
      // カウンセラー
      len2[h] = hatsugen[m + 1].length * width / bunsuu
      mazekoze[h] = hatsugen[m + 1]
      isFullConversationAnswerArr[h] = 0
      barChartAllHatsugenColorArr[h] = colorArrayInAllQuestionHatsugen[(m + 1) / 2]
      rectHatsugenNoArr[h] = m + 1
    }

    c = 0
    for (let m = 1; m < ranshin.length; m = m + 2) {
      for (let i = 0; i < ranshin[m].length; i++) {
        mazekozeRanshinArr[c] = ''
        if (ranshin[m][i][0] === 1) {
          mazekozeRanshinArr[c] = '病\n'
        }
        if (ranshin[m][i][1] === 1) {
          mazekozeRanshinArr[c] = '無気\n'
        }
        if (ranshin[m][i][2] === 1) {
          mazekozeRanshinArr[c] = '疑\n'
        }
        if (ranshin[m][i][3] === 1) {
          mazekozeRanshinArr[c] = '不注\n'
        }
        if (ranshin[m][i][4] === 1) {
          mazekozeRanshinArr[c] = '怠\n'
        }
        if (ranshin[m][i][5] === 1) {
          mazekozeRanshinArr[c] = '渇\n'
        }
        if (ranshin[m][i][6] === 1) {
          mazekozeRanshinArr[c] = '妄想\n'
        }
        if (ranshin[m][i][7] === 1) {
          mazekozeRanshinArr[c] = '新境\n'
        }
        if (ranshin[m][i][8] === 1) {
          mazekozeRanshinArr[c] = '落着'
        }
        c++
      }

      // ９種の乱心ストレージ保存

      // mazekozeRanshin[c]="";
      // c++;
    }
    // let width = width;
    var dataArr = [
      len2,
      len2
    ]// カウンセラ発言長とクライエント各文長の配列

    var xScale = d3.scale.linear()
      .domain([0, d3.sum(len2) / 10])
      .range([axisShiftX, width - axisShiftX])
    // .nice();

    let rectDataObjectArr = []
    let rectTxtNo
    let rextTxt = []
    let checkedNo = 0

    for (rectTxtNo = 0; rectTxtNo < len2.length; rectTxtNo++) { // 色変えたからか。。
      if (barChartAllHatsugenColorArr[rectTxtNo] === openColor) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.openQuestion
      } else if (barChartAllHatsugenColorArr[rectTxtNo] === aiduchiColor) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.feedback
      } else if (barChartAllHatsugenColorArr[rectTxtNo] === closeColor) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.closedQuestion
      } else if (barChartAllHatsugenColorArr[rectTxtNo] === kaishakuColor) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.interpretation
      } else　if(barChartAllHatsugenColorArr[rectTxtNo] === sekenColor) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.smallTalk
      }else{

        if (ansRadioResult[checkedNo] === 0) {
          rextTxt[rectTxtNo] = categoryOfTextOnRect.noGroup; checkedNo++
        } else if (ansRadioResult[checkedNo] === 1) {
          rextTxt[rectTxtNo] = categoryOfTextOnRect.love; checkedNo++
        } else if (ansRadioResult[checkedNo] === 2) {
          rextTxt[rectTxtNo] = categoryOfTextOnRect.friendship; checkedNo++
        } else if (ansRadioResult[checkedNo] === 3) {
          rextTxt[rectTxtNo] = categoryOfTextOnRect.work; checkedNo++
        } else if (ansRadioResult[checkedNo] === 4) {
          rextTxt[rectTxtNo] = categoryOfTextOnRect.self; checkedNo++
        } else if (ansRadioResult[checkedNo] === 5) {
          rextTxt[rectTxtNo] = categoryOfTextOnRect.spiritual; checkedNo++
        } else {
        }
      }
    }

    for (rectTxtNo = 0; rectTxtNo < len2.length; rectTxtNo++) {
      rectDataObjectArr[rectTxtNo] = {x: len2[rectTxtNo], y: 40, color: barChartAllHatsugenColorArr[rectTxtNo], text: rextTxt[rectTxtNo], which: isFullConversationAnswerArr[rectTxtNo]}
      // moji[jj]}//F_color2moji(color2[jj])}//, text:a}
    }

    svg.call(loveTexture)
    svg.call(workTexture)
    svg.call(friendTexture)
    svg.call(selfTexture)
    svg.call(spiritualTexture)

    let row = 0// graph3の行番号
    // 階層構造をとるため，g要素を生成する部分とrect要素を生成している部分が連続している．
    svg.selectAll('g')
      .data(dataArr)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (i * 50) + ')'
      })
      .selectAll('rect')
      .data(function (d) { return d })
      .enter()
      .append('rect')// 四角追加
      .attr('x', function (d, i) {
        var arr = len2
        // var sum = d3.sum(arr);
        var subSum = d3.sum(i === 0 ? [] : arr.slice(0, i))
        return xScale(subSum) / 10 + 10 + graphShiftX
      })
      .attr('y', 10)
      .attr('width', function (d) {
        // var sum = d3.sum(len2);
        return xScale(d) / 10
      })
      .attr('height', 20)
      .attr('fill', function (d, i) {
        if ((row === 0 && isFullConversationAnswerArr[i] === 0) || (row === 1 && isFullConversationAnswerArr[i] === 1)) {
          if (i + 1 === mazekoze.length) {
            row++
          }
          //return barChartAllHatsugenColorArr[i] //質問の場合はtextureを使いたい
          //一個の関数にして振り分けたい（配列やreturnはまずそう）

          /*if(/*answer){
            //moyou
          }else{
            //questionColor
          }*/

          switch (rextTxt[i]){
            case categoryOfTextOnRect.love:
              return loveTexture.url()
              break;
            case categoryOfTextOnRect.work:
              return workTexture.url()
              break;
            case categoryOfTextOnRect.friendship:
              return friendTexture.url()
              break;
            case categoryOfTextOnRect.self:
              return selfTexture.url()
              break;
            case categoryOfTextOnRect.spiritual:
              return spiritualTexture.url()
              break;
            case categoryOfTextOnRect.openQuestion:
              return openColor
              break;
            case categoryOfTextOnRect.closedQuestion:
              return closeColor
              break;
            case categoryOfTextOnRect.feedback:
              return aiduchiColor
              break;
            case categoryOfTextOnRect.interpretation:
              return kaishakuColor
              break;
            case categoryOfTextOnRect.smallTalk:
              return sekenColor
              break;
            default:
              return '#c0c0c0'
              break;
          }
        } else {
          if (i + 1 === mazekoze.length) {
            row++
          }
          return barChartBackgroundColor
        }
      })

      .on('mouseover', function (d, rectNo) {
          var msg = document.getElementById('msg')
          let txtViewHatsugenNo, l
          msg.innerHTML = ''
          if (isFullConversationAnswerArr[rectNo] === 0) {    // カウンセラーのグラフを触った時
            for (txtViewHatsugenNo = -3; txtViewHatsugenNo <= 3; txtViewHatsugenNo++) {
              if (rectHatsugenNoArr[rectNo] + txtViewHatsugenNo < 0 || rectHatsugenNoArr[rectNo] + txtViewHatsugenNo >= hatsugen.length) {
                continue
              }
              if (txtViewHatsugenNo === 0) {
                msg.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + rectHatsugenNoArr[rectNo]) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[rectHatsugenNoArr[rectNo] / 2] + '>【</font>' + hatsugen[rectHatsugenNoArr[rectNo]] + '<font color=' + colorArrayInAllQuestionHatsugen[rectHatsugenNoArr[rectNo] / 2] + '>】</font></u></b><font size=' + fontSizeInTextView + '><br><br>'
              } else if (txtViewHatsugenNo % 2 === 0) {
                msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>【</b></font>' + hatsugen[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]] + '<font color=' + colorArrayInAllQuestionHatsugen[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>】</b></font><br><br>'
              } else { // forループを回さないと各文ごとの表示ができない
                msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + clientInTextView + ' '
                for (l = 0; l < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; l++) {
                  if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] === '') { continue }
                  msg.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>【</b></font>' + bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>】</b></font>'
                }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br>'
              }
            }
          } else {  // 患者のグラフを触った時

            for (txtViewHatsugenNo = -3; txtViewHatsugenNo <= 3; txtViewHatsugenNo++) {
              if (rectHatsugenNoArr[rectNo] + txtViewHatsugenNo < 0 || rectHatsugenNoArr[rectNo] + txtViewHatsugenNo >= hatsugen.length) {
                continue
              }
              if (txtViewHatsugenNo === 0) {
                msg.innerHTML += '<b><font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + clientInTextView + ' '
                console.log("start for loop")
                for (let hatsugenBunNo = 0; hatsugenBunNo < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; hatsugenBunNo++) {
                  if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo] === '') { continue }
                  console.log("console.log")

                  console.log("rectNo %d",rectNo)
                  console.log("rectTxt %s",rextTxt[rectNo])

                  console.log(txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) //txtViewHatsugenNoは0なので、発言Noになる
                  console.log("ansCate %d",ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo])
                  console.log(answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]])

                  msg.innerHTML += '<u><b><font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]] + '>【</font>' + bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo] + '<font color=' + answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]] + '>】</b></font></font></u>'
                }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'

              } else if (txtViewHatsugenNo % 2 === 0) {
                msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + clientInTextView + ' '
                for (l = 0; l < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; l++) {
                  if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] === '') { continue }
                  msg.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>【</b></font>' + bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>】</b></font>'
                }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br>'
              } else { // forループを回さないと各文ごとの表示ができない
                msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewCounselor + ' <font color=' + colorArrayInAllQuestionHatsugen[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>【</b></font>' + hatsugen[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]] + '<font color=' + colorArrayInAllQuestionHatsugen[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>】</b></font><br><br>'
              }
            }
          }
        }
      )

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')

    svg.append('g')
      .attr({
        class: 'axis',
        transform: 'translate(0, 180)'
      })
      .call(xAxis)

    d3.select('svg')
      .append('text')
      .attr({
        x: 0,
        y: 20
      })
      .text(upperName)

    d3.select('svg')
      .append('text')
      .attr({
        x: 0,
        y: 70
      })
      .text(lowerName)

    addTextToSVG(0, axisDescriptionY, axisDescription)

  } else {
    //積み重ね
    vizStackChart()

  }
}

const ansRadioFullLen=rodata.ansRadioFullLen

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
