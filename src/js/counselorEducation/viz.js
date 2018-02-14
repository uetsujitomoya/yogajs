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

const loveC = '#ffaaff'
const friendC = '#a0ffa0'
const workC = '#90c0ff'
const ansTextureC={
  self:'#ffd700',
  spiritual:'#9370db'
}
const barChartBGColor = '#f9f9f9'

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
  .stroke(loveC)
  .background(loveBGColor)
const friendTexture= textures.lines()
  .orientation('3/8')
  .stroke(friendC)
  .background(friendBGColor)
const workTexture= textures.lines()
  .orientation('vertical', 'horizontal')
  .size(4)
  .strokeWidth(1)
  .shapeRendering('crispEdges')
  .stroke(workC)
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
const noCateAnsC= '#c0c0c0'

const rectTxtCate={
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

const txtViewFontSize = rodata.textViewFontSize

let vizPart = (talker, task, orijinalSentence) => {
  let box = (talker, task, orijinalSentence) => {
    // this.viz=;
  }

  let boxArr = []
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

const openC = rodata.color.open
const closeC = rodata.color.close
const aiduchiC = rodata.color.aiduchi
const sekenC = rodata.color.seken
const kaishakuC = rodata.color.kaishaku

const height0 = 200
const height = 200

const viz = (stackdataArr, allQueHatsugenCArr, bun, hatsugen, svg, ansCateNumArr, keitaisokaiseki, RGBmaxmax, startTime, graphTypeNum, ansRadioResult, ranshin, width, bunsuu) => {

  //console.log(ansRadioResult)
  const upperName = 'カウンセラー'
  const lowerName = 'クライエント'
  const txtViewCounselor = '<img src = "./picture/counselor2.jpg" width ="20">'
  const txtViewClient = '<img src = "./picture/client.jpg" width ="17">'

  let m

  var nagasa = []// 縦棒の位置
  nagasa[0] = 1 * width / (bunsuu + 1)
  for (m = 1; m < hatsugen.length; m = m + 2) {
    nagasa[(m + 1) / 2] = nagasa[-1 + (m + 1) / 2] + hatsugen[m].length * width / bunsuu
  }

  var margin2 = {top: 10, right: 10, bottom: 50, left: 40}

  //var colorBun = ['#c0c0c0', loveC, friendC, workC]
  const answerTextureChoiceArr = [noCateAnsC, loveC, friendC, workC, rodata.color.self.t, rodata.color.spiritual.t]

  const axisDescriptionY = 240

  if (graphTypeNum !== 1) {
    const axisDescription = '横軸の単位：全ての発言の全ての文字数'

    let graphShiftX = 58
    let axisShiftX = 68

    var len2 = []// 区分
    var mazekoze = []// カウンセラーを発言毎に、クライエントを文ごとに収録
    var isFullConversationAnsArr = []// カウンセラーなら0

    let barChartAllHatsugenColorArr = []
    let barChartAllHatsugenCateArr=[]

    let rectHatsugenNoArr = []
    let h = 0
    let mazekozeRanshinArr = []
    // 初手カウンセラー
    len2[0] = hatsugen[0].length * width / bunsuu
    mazekoze[0] = hatsugen[0]
    isFullConversationAnsArr[0] = 0
    barChartAllHatsugenColorArr[0] = allQueHatsugenCArr[0]
    barChartAllHatsugenCateArr[0] =
      rectHatsugenNoArr[0] = 0

    let c = 0

    for (m = 1; m < hatsugen.length; m = m + 2) {
      h++
      // クライエント
      bun[m].forEach((d) => {
        if (d !== '') {
          len2[h] = d.length * width / bunsuu
          mazekoze[h] = d
          isFullConversationAnsArr[h] = 1
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
      isFullConversationAnsArr[h] = 0
      barChartAllHatsugenColorArr[h] = allQueHatsugenCArr[(m + 1) / 2]
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
    let rectTxtArr = []
    let checkedNo = 0

    for (rectTxtNo = 0; rectTxtNo < len2.length; rectTxtNo++) { // 色変えたからか。。
      if (barChartAllHatsugenColorArr[rectTxtNo] === openC) {
        rectTxtArr[rectTxtNo] = rectTxtCate.openQuestion
      } else if (barChartAllHatsugenColorArr[rectTxtNo] === aiduchiC) {
        rectTxtArr[rectTxtNo] = rectTxtCate.feedback
      } else if (barChartAllHatsugenColorArr[rectTxtNo] === closeC) {
        rectTxtArr[rectTxtNo] = rectTxtCate.closedQuestion
      } else if (barChartAllHatsugenColorArr[rectTxtNo] === kaishakuC) {
        rectTxtArr[rectTxtNo] = rectTxtCate.interpretation
      } else　if(barChartAllHatsugenColorArr[rectTxtNo] === sekenC) {
        rectTxtArr[rectTxtNo] = rectTxtCate.smallTalk
      }else{

        if (ansRadioResult[checkedNo] === 0) {
          rectTxtArr[rectTxtNo] = rectTxtCate.noGroup; checkedNo++
        } else if (ansRadioResult[checkedNo] === 1) {
          rectTxtArr[rectTxtNo] = rectTxtCate.love; checkedNo++
        } else if (ansRadioResult[checkedNo] === 2) {
          rectTxtArr[rectTxtNo] = rectTxtCate.friendship; checkedNo++
        } else if (ansRadioResult[checkedNo] === 3) {
          rectTxtArr[rectTxtNo] = rectTxtCate.work; checkedNo++
        } else if (ansRadioResult[checkedNo] === 4) {
          rectTxtArr[rectTxtNo] = rectTxtCate.self; checkedNo++
        } else if (ansRadioResult[checkedNo] === 5) {
          rectTxtArr[rectTxtNo] = rectTxtCate.spiritual; checkedNo++
        } else {
        }
      }
    }

    for (rectTxtNo = 0; rectTxtNo < len2.length; rectTxtNo++) {
      rectDataObjectArr[rectTxtNo] = {x: len2[rectTxtNo], y: 40, color: barChartAllHatsugenColorArr[rectTxtNo], text: rectTxtArr[rectTxtNo], which: isFullConversationAnsArr[rectTxtNo]}
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
        if ((row === 0 && isFullConversationAnsArr[i] === 0) || (row === 1 && isFullConversationAnsArr[i] === 1)) {
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

          switch (rectTxtArr[i]){
            case rectTxtCate.love:
              return loveTexture.url()
              break;
            case rectTxtCate.work:
              return workTexture.url()
              break;
            case rectTxtCate.friendship:
              return friendTexture.url()
              break;
            case rectTxtCate.self:
              return selfTexture.url()
              break;
            case rectTxtCate.spiritual:
              return spiritualTexture.url()
              break;
            case rectTxtCate.openQuestion:
              return openC
              break;
            case rectTxtCate.closedQuestion:
              return closeC
              break;
            case rectTxtCate.feedback:
              return aiduchiC
              break;
            case rectTxtCate.interpretation:
              return kaishakuC
              break;
            case rectTxtCate.smallTalk:
              return sekenC
              break;
            default:
              return '#c0c0c0'
              break;
          }
        } else {
          if (i + 1 === mazekoze.length) {
            row++
          }
          return barChartBGColor
        }
      })

      .on('mouseover', function (d, rectNo) {
          console.log(allQueHatsugenCArr)
          var msg = document.getElementById('msg')
          let txtViewHatsugenNo, l
          msg.innerHTML = ''
          if (isFullConversationAnsArr[rectNo] === 0) {    // カウンセラーのグラフを触った時
            for (txtViewHatsugenNo = -3; txtViewHatsugenNo <= 3; txtViewHatsugenNo++) {
              if (rectHatsugenNoArr[rectNo] + txtViewHatsugenNo < 0 || rectHatsugenNoArr[rectNo] + txtViewHatsugenNo >= hatsugen.length) {
                continue
              }
              if (txtViewHatsugenNo === 0) {
                console.log("allQueHatsugenCArr[rectHatsugenNoArr[rectNo] / 2] %s",allQueHatsugenCArr[rectHatsugenNoArr[rectNo] / 2])
                console.log("rectHatsugenNoArr[rectNo] / 2 %d",rectHatsugenNoArr[rectNo] / 2)
                msg.innerHTML += '<b><u><font size=' + txtViewFontSize + '>' + (1 + rectHatsugenNoArr[rectNo]) + '' + txtViewCounselor + ' <font color=' + allQueHatsugenCArr[rectHatsugenNoArr[rectNo] / 2] + '>【</font>' + hatsugen[rectHatsugenNoArr[rectNo]] + '<font color=' + allQueHatsugenCArr[rectHatsugenNoArr[rectNo] / 2] + '>】</font></u></b><font size=' + txtViewFontSize + '><br><br>'

              } else if (txtViewHatsugenNo % 2 === 0) {
                msg.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewCounselor + ' <font color=' + allQueHatsugenCArr[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>【</b></font>' + hatsugen[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]] + '<font color=' + allQueHatsugenCArr[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>】</b></font><br><br>'
              } else { // forループを回さないと各文ごとの表示ができない
                msg.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewClient + ' '
                for (l = 0; l < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; l++) {
                  if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] === '') { continue }
                  msg.innerHTML += '<font size=' + txtViewFontSize + '><font color=' + answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>【</b></font>' + bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] + '<font color=' + answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>】</b></font>'
                }
                msg.innerHTML += '<font size=' + txtViewFontSize + '><br><br>'
              }
            }
          } else {  // 患者のグラフを触った時

            for (txtViewHatsugenNo = -3; txtViewHatsugenNo <= 3; txtViewHatsugenNo++) {
              if (rectHatsugenNoArr[rectNo] + txtViewHatsugenNo < 0 || rectHatsugenNoArr[rectNo] + txtViewHatsugenNo >= hatsugen.length) {
                continue
              }
              if (txtViewHatsugenNo === 0) {
                msg.innerHTML += '<b><font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewClient + ' '
                //console.log("start for loop")
                for (let hatsugenBunNo = 0; hatsugenBunNo < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; hatsugenBunNo++) {
                  if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo] === '') { continue }
                  //console.log("console.log")

                  //console.log("rectNo %d",rectNo)
                  //console.log("rectTxt %s",rectTxtArr[rectNo])

                  //console.log("%d発言目",txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) //txtViewHatsugenNoは0なので、発言Noになる
                  //console.log("ansCate %d",ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo])
                  //console.log(answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]])

                  msg.innerHTML += '<u><b><font size=' + txtViewFontSize + '><font color=' + answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]] + '>【</font>' + bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo] + '<font color=' + answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]] + '>】</b></font></font></u>'
                }
                msg.innerHTML += '<font size=' + txtViewFontSize + '><br><br></font>'

              } else if (txtViewHatsugenNo % 2 === 0) {
                msg.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewClient + ' '
                for (l = 0; l < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; l++) {
                  if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] === '') { continue }
                  msg.innerHTML += '<font size=' + txtViewFontSize + '><font color=' + answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>【</b></font>' + bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l] + '<font color=' + answerTextureChoiceArr[ansCateNumArr[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][l]] + '><b>】</b></font>'
                }
                msg.innerHTML += '<font size=' + txtViewFontSize + '><br><br>'
              } else { // forループを回さないと各文ごとの表示ができない
                msg.innerHTML += '<font size=' + txtViewFontSize + '>' + (1 + txtViewHatsugenNo + rectHatsugenNoArr[rectNo]) + '' + txtViewCounselor + ' <font color=' + allQueHatsugenCArr[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>【</b></font>' + hatsugen[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]] + '<font color=' + allQueHatsugenCArr[txtViewHatsugenNo / 2 + rectHatsugenNoArr[rectNo] / 2] + '><b>】</b></font><br><br>'
              }
            }
          }
        }
      )
      .on("click", function(d,rectNo){
        if (isFullConversationAnsArr[rectNo] === 0) {

          return tooltip.style("visibility", "visible").text(hatsugen[rectHatsugenNoArr[rectNo]]);
        }else{

          let msg=""
          const txtViewHatsugenNo=0

          for (let hatsugenBunNo = 0; hatsugenBunNo < bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]].length; hatsugenBunNo++) {
            if (bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo] === '') { continue }

            msg+= bun[txtViewHatsugenNo + rectHatsugenNoArr[rectNo]][hatsugenBunNo]
          }

          return tooltip.style("visibility", "visible").text( msg );

        }

      })//吹き出し

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
