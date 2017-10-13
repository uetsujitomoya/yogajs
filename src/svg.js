// <コンパイル方法>
// yogajsまで移動
// npm run build でコンパイル

import d3 from 'd3'
import textures from 'textures'
import {rodata} from './js/rodata'

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

/*
 if(checked2[c]==3){
 color2[c]="#b0291b";
 }else if(checked2[c]==5){
 color2[c]="#9b59b6";
 }else if(checked2[c]==4){
 color2[c]="#2980b9";
 }else if(checked2[c]==6){
 color2[c]="#f1c40f";
 }else{
 color2[c]="#2c3e50";
 }
 */

let vizPart = (talker, task, orijinalSentence) => {
  let box = (talker, task, orijinalSentence) => {
    // this.viz=;
  }

  let boxArray = []
}

let originalSentencePart = (talker, task, orijinalSentence) => {
  let sentenceViz = (talker, task, orijinalSentence) => {
    // this.viz=;
  }

  let sentenceVizArray = []
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

const openColor = '#b0291b'
const closeColor = '#2980b9'
const aiduchiColor = '#9b59b6'
const sekenColor = '#2c3e50'
const kaishakuColor = '#f1c40f'

const height0 = 200
const height = 200

const viz = (stackdataArr, colorArrayInAllQuestionHatsugen, bun, hatsugen, svg, checkedBun, keitaisokaiseki, RGBmaxmax, startTime, graphTypeNum, checked, ranshin, width, bunsuu) => {
  const upperName = 'カウンセラー'
  const lowerName = 'クライエント'
  const counselorInTextView = '<img src = "./picture/counselor2.jpg" width ="20">'
  const clientInTextView = '<img src = "./picture/client.jpg" width ="17">'
  const fontSizeInTextView = 2

  let m

  var nagasa = []// 縦棒の位置
  nagasa[0] = 1 * width / (bunsuu + 1)
  for (m = 1; m < hatsugen.length; m = m + 2) {
    nagasa[(m + 1) / 2] = nagasa[-1 + (m + 1) / 2] + hatsugen[m].length * width / bunsuu
  }

  var margin2 = {top: 10, right: 10, bottom: 50, left: 40}

  //var colorBun = ['#c0c0c0', loveColor, friendColor, workColor]
  const answerTextureChoiceArray = [noCategoryAnswerColor, loveColor, friendColor, workColor, rodata.color.self.t, rodata.color.spiritual.t]

  console.log(answerTextureChoiceArray)

  const axisDescriptionY = 240

  if (graphTypeNum !== 1) {
    const axisDescription = '横軸の単位：全ての発言の全ての文字数'

    let graphShiftX = 58
    let axisShiftX = 68

    var nagasa2 = []// 区分
    var mazekoze = []// カウンセラーを発言毎に、クライエントを文ごとに収録
    var isAnswerInFullConversation_array = []// カウンセラーなら0

    let barChartAllHatsugenColorArray = []
    let barChartAllHatsugenCategoryArray=[]

    let mazekozeHatsugenNumArray = []
    let h = 0
    let mazekozeRanshinArray = []
    // 初手カウンセラー
    nagasa2[0] = hatsugen[0].length * width / bunsuu
    mazekoze[0] = hatsugen[0]
    isAnswerInFullConversation_array[0] = 0
    barChartAllHatsugenColorArray[0] = colorArrayInAllQuestionHatsugen[0]
    barChartAllHatsugenCategoryArray[0] =
      mazekozeHatsugenNumArray[0] = 0

    let c = 0

    for (m = 1; m < hatsugen.length; m = m + 2) {
      h++
      // クライエント
      bun[m].forEach((d) => {
        if (d !== '') {
          nagasa2[h] = d.length * width / bunsuu
          mazekoze[h] = d
          isAnswerInFullConversation_array[h] = 1
          barChartAllHatsugenColorArray[h] = answerTextureChoiceArray[checked[c]]
          mazekozeHatsugenNumArray[h] = m
          h++
          c++
        }
      })
      if (m + 1 === hatsugen.length) {
        break
      }
      // カウンセラー
      nagasa2[h] = hatsugen[m + 1].length * width / bunsuu
      mazekoze[h] = hatsugen[m + 1]
      isAnswerInFullConversation_array[h] = 0
      barChartAllHatsugenColorArray[h] = colorArrayInAllQuestionHatsugen[(m + 1) / 2]
      mazekozeHatsugenNumArray[h] = m + 1
    }

    //console.info('ranshin')
    //console.info(ranshin)

    c = 0
    for (let m = 1; m < ranshin.length; m = m + 2) {
      for (let i = 0; i < ranshin[m].length; i++) {
        mazekozeRanshinArray[c] = ''
        if (ranshin[m][i][0] === 1) {
          mazekozeRanshinArray[c] = '病\n'
        }
        if (ranshin[m][i][1] === 1) {
          mazekozeRanshinArray[c] = '無気\n'
        }
        if (ranshin[m][i][2] === 1) {
          mazekozeRanshinArray[c] = '疑\n'
        }
        if (ranshin[m][i][3] === 1) {
          mazekozeRanshinArray[c] = '不注\n'
        }
        if (ranshin[m][i][4] === 1) {
          mazekozeRanshinArray[c] = '怠\n'
        }
        if (ranshin[m][i][5] === 1) {
          mazekozeRanshinArray[c] = '渇\n'
        }
        if (ranshin[m][i][6] === 1) {
          mazekozeRanshinArray[c] = '妄想\n'
        }
        if (ranshin[m][i][7] === 1) {
          mazekozeRanshinArray[c] = '新境\n'
        }
        if (ranshin[m][i][8] === 1) {
          mazekozeRanshinArray[c] = '落着'
        }
        c++
      }

      // ９種の乱心ストレージ保存

      // mazekozeRanshin[c]="";
      // c++;
    }

    console.info('mazekozeRanshin')
    console.info(mazekozeRanshinArray)

    // let width = width;

    var dataArr = [
      nagasa2,
      nagasa2
    ]// カウンセラ発言長とクライエント各文長の配列

    var xScale = d3.scale.linear()
      .domain([0, d3.sum(nagasa2) / 10])
      .range([axisShiftX, width - axisShiftX])
    // .nice();

    /// /////////////////////////////////////////////////////////////

    let rectDataObjectArray = []
    let textOnRectNum
    let textOnRect = []
    let checkedNum = 0

    for (textOnRectNum = 0; textOnRectNum < nagasa2.length; textOnRectNum++) { // 色変えたからか。。
      if (barChartAllHatsugenColorArray[textOnRectNum] === openColor) {
        textOnRect[textOnRectNum] = categoryOfTextOnRect.openQuestion
      } else if (barChartAllHatsugenColorArray[textOnRectNum] === aiduchiColor) {
        textOnRect[textOnRectNum] = categoryOfTextOnRect.feedback
      } else if (barChartAllHatsugenColorArray[textOnRectNum] === closeColor) {
        textOnRect[textOnRectNum] = categoryOfTextOnRect.closedQuestion
      } else if (barChartAllHatsugenColorArray[textOnRectNum] === kaishakuColor) {
        textOnRect[textOnRectNum] = categoryOfTextOnRect.interpretation
      } else　if(barChartAllHatsugenColorArray[textOnRectNum] === sekenColor) {
        textOnRect[textOnRectNum] = categoryOfTextOnRect.smallTalk
      }else{
        //console.log('checked = %d',checkedNum)
        //console.log('checked[%d]=%d', checkedNum,checked[checkedNum])

        if (checked[checkedNum] === 0) {
          textOnRect[textOnRectNum] = categoryOfTextOnRect.noGroup; checkedNum++
        } else if (checked[checkedNum] === 1) {
          textOnRect[textOnRectNum] = categoryOfTextOnRect.love; checkedNum++
        } else if (checked[checkedNum] === 2) {
          textOnRect[textOnRectNum] = categoryOfTextOnRect.friendship; checkedNum++
        } else if (checked[checkedNum] === 3) {
          textOnRect[textOnRectNum] = categoryOfTextOnRect.work; checkedNum++
        } else if (checked[checkedNum] === 4) {
          textOnRect[textOnRectNum] = categoryOfTextOnRect.self; checkedNum++
        } else if (checked[checkedNum] === 5) {
          textOnRect[textOnRectNum] = categoryOfTextOnRect.spiritual; checkedNum++
        } else {
          alert('undefined')
        }
      }
    }

    console.log('textOnRect')
    console.log(textOnRect)

    for (textOnRectNum = 0; textOnRectNum < nagasa2.length; textOnRectNum++) {
      rectDataObjectArray[textOnRectNum] = {x: nagasa2[textOnRectNum], y: 40, color: barChartAllHatsugenColorArray[textOnRectNum], text: textOnRect[textOnRectNum], which: isAnswerInFullConversation_array[textOnRectNum]}
      // moji[jj]}//F_color2moji(color2[jj])}//, text:a}
    }

    //	console.log(rectDataObjectArray.length);
    //	console.log(nagasa2.length);
    /// ////////////////////////////////////////////////////
    console.log('mazekozeHatsugenNumber')
    console.log(mazekozeHatsugenNumArray)

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
        var arr = nagasa2
        // var sum = d3.sum(arr);
        var subSum = d3.sum(i === 0 ? [] : arr.slice(0, i))
        return xScale(subSum) / 10 + 10 + graphShiftX
      })
      .attr('y', 10)
      .attr('width', function (d) {
        // var sum = d3.sum(nagasa2);
        return xScale(d) / 10
      })
      .attr('height', 20)
      .attr('fill', function (d, i) {
        if ((row === 0 && isAnswerInFullConversation_array[i] === 0) || (row === 1 && isAnswerInFullConversation_array[i] === 1)) {
          if (i + 1 === mazekoze.length) {
            row++
          }
          //return barChartAllHatsugenColorArray[i] //質問の場合はtextureを使いたい
          //一個の関数にして振り分けたい（配列やreturnはまずそう）

          /*if(/*answer){
            //moyou
          }else{
            //questionColor
          }*/

          switch (textOnRect[i]){
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

      .on('mouseover', function (d, i) {
        var msg = document.getElementById('msg')
        let k, l
        msg.innerHTML = ''
        if (isAnswerInFullConversation_array[i] === 0) {    // カウンセラー
          for (k = -3; k <= 3; k++) {
            if (mazekozeHatsugenNumArray[i] + k < 0 || mazekozeHatsugenNumArray[i] + k >= hatsugen.length) {
              continue
            }
            if (k === 0) {
              msg.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + mazekozeHatsugenNumArray[i]) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[mazekozeHatsugenNumArray[i] / 2] + '>【</font>' + hatsugen[mazekozeHatsugenNumArray[i]] + '<font color=' + colorArrayInAllQuestionHatsugen[mazekozeHatsugenNumArray[i] / 2] + '>】</font></u></b><font size=' + fontSizeInTextView + '><br><br>'
            } else if (k % 2 === 0) {
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + mazekozeHatsugenNumArray[i]) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[k / 2 + mazekozeHatsugenNumArray[i] / 2] + '><b>【</b></font>' + hatsugen[k + mazekozeHatsugenNumArray[i]] + '<font color=' + colorArrayInAllQuestionHatsugen[k / 2 + mazekozeHatsugenNumArray[i] / 2] + '><b>】</b></font><br><br>'
            } else { // forループを回さないと各文ごとの表示ができない
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + mazekozeHatsugenNumArray[i]) + '' + clientInTextView + ' '
              for (l = 0; l < bun[k + mazekozeHatsugenNumArray[i]].length; l++) {
                if (bun[k + mazekozeHatsugenNumArray[i]][l] === '') { continue }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] + '><b>【</b></font>' + bun[k + mazekozeHatsugenNumArray[i]][l] + '<font color=' + answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] + '><b>】</b></font>'
                console.log( bun[k + mazekozeHatsugenNumArray[i]][l] )
                console.log( answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] )
              }
              msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br>'
            }
          }
        } else {  // 患者
          for (k = -3; k <= 3; k++) {
            if (mazekozeHatsugenNumArray[i] + k < 0 || mazekozeHatsugenNumArray[i] + k >= hatsugen.length) {
              continue
            }
            if (k === 0) {
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + mazekozeHatsugenNumArray[i]) + '' + clientInTextView + ' '
              for (l = 0; l < bun[k + mazekozeHatsugenNumArray[i]].length; l++) {
                if (bun[k + mazekozeHatsugenNumArray[i]][l] === '') { continue }
                msg.innerHTML += '<u><font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] + '><b>【</b></font>' + bun[k + mazekozeHatsugenNumArray[i]][l] + '<font color=' + answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] + '><b>】</b></font></font></u>'
                console.log( bun[k + mazekozeHatsugenNumArray[i]][l] )
                console.log(answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]])
              }
              msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'
            } else if (k % 2 === 0) {
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + mazekozeHatsugenNumArray[i]) + '' + clientInTextView + ' '
              for (l = 0; l < bun[k + mazekozeHatsugenNumArray[i]].length; l++) {
                if (bun[k + mazekozeHatsugenNumArray[i]][l] === '') { continue }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] + '><b>【</b></font>' + bun[k + mazekozeHatsugenNumArray[i]][l] + '<font color=' + answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]] + '><b>】</b></font>'
                console.log(bun[k + mazekozeHatsugenNumArray[i]][l])
                console.log(answerTextureChoiceArray[checkedBun[k + mazekozeHatsugenNumArray[i]][l]])
              }
              msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br>'
            } else { // forループを回さないと各文ごとの表示ができない
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + mazekozeHatsugenNumArray[i]) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[k / 2 + mazekozeHatsugenNumArray[i] / 2] + '><b>【</b></font>' + hatsugen[k + mazekozeHatsugenNumArray[i]] + '<font color=' + colorArrayInAllQuestionHatsugen[k / 2 + mazekozeHatsugenNumArray[i] / 2] + '><b>】</b></font><br><br>'
            }
          }
        }
      })
    /// //////////////////////////////////////////////////////////////////

    // 下側の文字？じゃなかった

    /*
     svg.selectAll("g")
     .data(rectDataObjectArray)
     .enter()
     .append("g")

     .selectAll('text')
     .data(rectDataObjectArray)
     .enter()
     .append('text')
     .text((d)=>d.text)
     .style("font-size",15)

     .attr("x",function(d,i){
     var arr = nagasa2;
     //var sum = d3.sum(arr);
     var subSum = d3.sum(i==0 ? []:arr.slice(0,i));
     return xScale(subSum)/10 + 10+graphShiftX;
     })
     .attr(
     "y",function(d){
     return 35+d.which*50;
     }
     );
     */

    /// //////////////////////////////////////////////////////////////////

    /*　9つの乱心　表示

     svg.selectAll("g")
     .data(mazekozeRanshin)
     .enter()
     .append("g")
     .selectAll('text')
     .data(mazekozeRanshin)
     .enter()
     .append('text')
     .text((d)=>{
     return d;
     })
     .style("font-size",15)

     .attr("x",function(d,i){
     var arr = nagasa2;
     //var sum = d3.sum(arr);
     var subSum = d3.sum(i==0 ? []:arr.slice(0,i));
     return xScale(subSum)/11 + graphShiftX;
     })
     .attr("y",100);

     */

    // x軸

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

    console.info('rectDataObjectArray')
    console.info(rectDataObjectArray)

  } else {

    // 積み重ね折れ線

    const axisDescription = '縦軸の単位：文の数、 横軸の単位：患者の全ての発言の全ての文字数'

    // stack
    var context = svg.append('g') // 全体グラフグループ作成
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')')

    var scaleY = d3.scale.linear().domain([0, 6]).range([0, height0])
    var colors = [workColor, friendColor, loveColor]

    var stack = d3.layout.stack()
      .x(function () { return 1 })
      .y(function (d) { return d.y })
      .values(function (d) { return d })
    var stackdata = stack(stackdataArr)

    var area0 = d3.svg.area()
      .x(function (d, i) {
        if (i % 3 === 0) { return nagasa[i / 3] } else if (i % 3 === 1) { return nagasa[(i - 1) / 3 + 1] - 3 } else { return nagasa[(i - 2) / 3 + 1] - 2 }
      })// nagasa[i]+nagasa[i+1])/2
      .y0(function () { return height0 })
      .y1(function (d) { return height0 - scaleY(d.y + d.y0) })

    context.selectAll('path')
      .data(stackdata.reverse())
      .enter()
      .append('path')
      .attr('d', area0)
      .attr('fill', function (d, i) { return colors[i] })
    // 以上、stack

    // 棒
    const range = d3.range((width) - (width / (colorArrayInAllQuestionHatsugen.length * 2)), colorArrayInAllQuestionHatsugen.length - 1, -width / (colorArrayInAllQuestionHatsugen.length))
    context.selectAll('line.v')
      .data(range).enter().append('line')
      .attr('x1', function (d, i) {
        return nagasa[i]
      }).attr('y1', 0)
      .attr('x2', function (d, i) { return nagasa[i] }).attr('y2', height0)

    context.selectAll('line')
      .attr('stroke', function (d, i) {
        return colorArrayInAllQuestionHatsugen[i]
      })
      .attr('stroke-width', function (d, i) {
        return (Math.sqrt(keitaisokaiseki[2 * i].length))
      })
      .on('mouseover', function (d, i) {
        var e = document.getElementById('msg')
        var k, l
        e.innerHTML = ''
        for (k = -3; k <= 3; k++) {
          if (2 * (i) + k < 0 || 2 * (i) + k >= hatsugen.length) {
            continue
          }
          if (k === 0) {
            e.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + 2 * i) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[i] + '>【</font>' + hatsugen[2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[i] + '>】</font></font></u></b><font size=' + fontSizeInTextView + '><br><br>'
          } else if (k % 2 === 0) {
            e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>【</b></font>' + hatsugen[k + 2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>】</b></font><br><br>'
          } else { // forループを回さないと各文ごとの表示ができない
            e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + clientInTextView + ' '
            for (l = 0; l < bun[k + 2 * i].length; l++) {
              if (bun[k + 2 * i][l] === '') { continue }
              e.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArray[checkedBun[k + 2 * i][l]] + '><b>【</b></font>' + bun[k + 2 * i][l] + '<font color=' + answerTextureChoiceArray[checkedBun[k + 2 * i][l]] + '><b>】</b></font></font>'
            }
            e.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'
          }
        }
      })
    /// //////////////////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////変更部分小林下

    let datae3 = []
    let jj3
    let mojia1 = []

    for (jj3 = 0; jj3 < nagasa.length; jj3++) {
      if (colorArrayInAllQuestionHatsugen[jj3] === openColor) {
        mojia1[jj3] = '開 質問'
      } else if (colorArrayInAllQuestionHatsugen[jj3] === aiduchiColor) {
        mojia1[jj3] = '相槌'
      } else if (colorArrayInAllQuestionHatsugen[jj3] === closeColor) {
        mojia1[jj3] = '閉 質問'
      } else if (colorArrayInAllQuestionHatsugen[jj3] === kaishakuColor) {
        mojia1[jj3] = '解釈'
      } else {
        mojia1[jj3] = '世間話'
      }
    }

    for (jj3 = 0; jj3 < nagasa.length; jj3++) {
      datae3[jj3] = {x: nagasa[jj3], y: 10, color: colorArrayInAllQuestionHatsugen[jj3], text: mojia1[jj3]}// moji[jj3]}//F_color2moji(color2[jj3])}//, text:a}
    }
    context.selectAll('circle')
      .data(datae3)
      .enter()
      .append('circle')
      .attr({
        cx: (d) => d.x,
        cy: (d) => d.y,
        r: 13
      })
      .style('fill', (d) => d.color)
      .on('mouseover', function (d, i) {
        var e = document.getElementById('msg')
        var k, l
        e.innerHTML = ''
        for (k = -3; k <= 3; k++) {
          if (2 * (i) + k < 0 || 2 * (i) + k >= hatsugen.length) {
            continue
          }
          if (k === 0) {
            e.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + 2 * i) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[i] + '>【</font>' + hatsugen[2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[i] + '>】</font></font></u></b><font size=' + fontSizeInTextView + '><br><br>'
          } else if (k % 2 === 0) {
            e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + counselorInTextView + ' <font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>【</b></font>' + hatsugen[k + 2 * i] + '<font color=' + colorArrayInAllQuestionHatsugen[k / 2 + i] + '><b>】</b></font><br><br>'
          } else { // forループを回さないと各文ごとの表示ができない
            e.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + k + 2 * i) + '' + clientInTextView + ' '
            for (l = 0; l < bun[k + 2 * i].length; l++) {
              if (bun[k + 2 * i][l] === '') { continue }
              e.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArray[checkedBun[k + 2 * i][l]] + '><b>【</b></font>' + bun[k + 2 * i][l] + '<font color=' + answerTextureChoiceArray[checkedBun[k + 2 * i][l]] + '><b>】</b></font></font><br>   '
            }
            e.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'
          }
        }
      })

    /*
     context.selectAll('text')
     .data(datae3)
     .enter()
     .append('text')
     .text((d)=> d.text)
     .style("font-size",12)
     .attr({
     x: (d) => d.x+3,
     y: (d) => d.y+25,
     fill: (d) => d.color
     });
     */

    /// /////*////////////////////////////////////////////////////////
    /// ////////////////////////////////////////////////////////////
    var scaleX2 = d3.scale.linear().domain([0, bunsuu]).range([0, width])
    var scaleY2 = d3.scale.linear().domain([0, RGBmaxmax]).range([height, 0])
    var yAxisC = d3.svg.axis().scale(scaleY2).orient('left')// focus

    var xAxisC = d3.svg.axis().scale(scaleX2).orient('bottom')// context

    context.append('g') // focusのy目盛軸
      .attr('class', 'y axis')
      .call(yAxisC)

    context.append('g') // 全体x目盛軸
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height0 + ')')
      .call(xAxisC)

    addTextToSVG(0, axisDescriptionY, axisDescription)
  }
}

const answerRadioFullLength=5

const readAnswerRadio = (jsonFileName, storage, chboxlist, answerRadioResult, taiou, chboxlength, isUsingDictionaryWithWord2Vec) => {
  let graphNumber = 2

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
      // console.log("i=%d",i);
      // console.log(radio[i]);
      if (answerRadio[i].control.checked === true) {
        console.log(answerRadio[i].control.value)
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
          console.log('set self')
          break
        }else if (answerRadio[i].control.value === '5') {
          answerRadioResult[taiou[c - 1]] = 5
          storage.setItem(changedAnswerClassificationSaveTarget, 4)
          console.log('set spiritual')
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
  for (c = 1; c <= chboxlength2; c++) {
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

const setForViz = (name, storage, keitaisokaiseki, chboxlist, chboxlist2, RGBlist, hatsugen, bun, answerRadioResult, questionRadioResult, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, zoom_value) => {
  let isUsingDictionaryWithWord2Vec = 0

  var bunsuu = 2// 前後の余白
  for (m = 1; m < hatsugen.length; m = m + 2) { // 患者の発言で間隔を作る
    bunsuu = bunsuu + hatsugen[m].length
  }
  console.info(zoom_value)
  var width = zoom_value * bunsuu

  console.log('%centerred setForViz', 'color:red')

  let graphNumber = 2

  d3.select('#svgdiv').select('svg').remove()
  var svg = d3.select('#svgdiv').append('svg')
    .attr('height', 270)

    .attr('width', width)
  var colorArrayInAllQuestionHatsugen = []
  var stackdataArr = []
  if (chboxlength >= 1) {
    readAnswerRadio(name, storage, chboxlist, answerRadioResult, taiou, chboxlength, isUsingDictionaryWithWord2Vec)
  }
  if (chboxlength2 >= 1) {
    readQuestionRadio(name, storage, chboxlist, chboxlist2, questionRadioResult, taiou, taiou2, chboxlength, chboxlength2)
  }

  var h, i, c, m, n

  for (n = 0; n < RGBlist.length; n++) {
    RGBlist[n][0] = 0
    RGBlist[n][1] = 0
    RGBlist[n][2] = 0
  }

  var checkedBun = []
  n = 0// m=1;m<keitaisokaiseki.length;m=m+2の外
  for (m = 1; m < keitaisokaiseki.length; m = m + 2) {
    checkedBun[m] = []// svgでの描画ではm→i
    for (i = 0; i < keitaisokaiseki[m].length; i++) {
      checkedBun[m][i] = 0
      for (c = 1; c < chboxlist.length; c++) {
        if (bun[m][i] === chboxlist[c][0]) {
          if (answerRadioResult[c - 1] === 1) {
            RGBlist[n][0] = RGBlist[n][0] + 1
            checkedBun[m][i] = 1
          } else if (answerRadioResult[c - 1] === 2) {
            RGBlist[n][1] = RGBlist[n][1] + 1
            checkedBun[m][i] = 2
          } else if (answerRadioResult[c - 1] === 3) {
            RGBlist[n][2] = RGBlist[n][2] + 1
            checkedBun[m][i] = 3
          }
        }
      }
    }
    n++
  }

  let categoryArrayInAllQuestionHatsugen=[]
  for (c = 0; c < questionRadioResult.length; c++) {
    if (questionRadioResult[c] === 3) {
      colorArrayInAllQuestionHatsugen[c] = openColor
    } else if (questionRadioResult[c] === 5) {
      colorArrayInAllQuestionHatsugen[c] = aiduchiColor
    } else if (questionRadioResult[c] === 4) {
      colorArrayInAllQuestionHatsugen[c] = closeColor
    } else if (questionRadioResult[c] === 6) {
      colorArrayInAllQuestionHatsugen[c] = kaishakuColor
    } else {
      colorArrayInAllQuestionHatsugen[c] = sekenColor
    }
  }

  var RGBmax = []
  var RGBmaxmax = 1

  for (m = 0; m < ((keitaisokaiseki.length - 1) / 2); m++) {
    // 2個飛ばしにしたら後が面倒くさい。患者 1→0,3→1,長さ9なら番号は8まで
    RGBmax[m] = 1
    for (h = 0; h < 3; h++) {
      RGBmax[m] = RGBmax[m] + RGBlist[m][h]
    }
    if (RGBmaxmax < RGBmax[m]) {
      RGBmaxmax = RGBmax[m]
    }
  }

  const radio = document.getElementById('graph').children
  console.log('radio')
  console.log(radio)
  for (let i = 0; i <= graphNumber - 1; i++) {
    console.log('i=%d', i)
    console.log(radio[i])
    if (radio[i].control.checked === true) {
      // storage.getItem(name+"RGBlist"+m)=
      /* if(radio[i].control.value=="12"){
       graph=2;
       }else */if (radio[i].control.value === '13') {
        graph = 3
      } else {
        graph = 1
      }
    }
  }

  for (h = 0; h < 3; h++) {
    stackdataArr[h] = []
    for (m = 0; m < ((keitaisokaiseki.length - 1) / 2); m++) {
      stackdataArr[h][3 * m] = new Object()
      if (graph === 2) {
        stackdataArr[h][3 * m] = {x: 3 * m + 1, y: 0}
      } else {
        stackdataArr[h][3 * m] = {x: 3 * m + 1, y: (5 * (RGBlist[m][h]) / RGBmaxmax)}
      }

      stackdataArr[h][3 * m + 1] = new Object()
      stackdataArr[h][3 * m + 1] = {x: 3 * m + 2, y: (5 * (RGBlist[m][h]) / RGBmaxmax)}
      stackdataArr[h][3 * m + 2] = new Object()
      stackdataArr[h][3 * m + 2] = {x: 3 * m + 3, y: 0}
    }
  }
  viz(stackdataArr, colorArrayInAllQuestionHatsugen, bun, hatsugen, svg, checkedBun, keitaisokaiseki, RGBmaxmax, startTime, graph, answerRadioResult, ranshin, width, bunsuu)
  // console.log("chboxlength2 in svg.js=%d",chboxlength2);
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

const createCircleWithTexture = () => { // example
  var svg = d3.select('#example')
    .append('svg')

  var t = textures.lines()
    .thicker()

  svg.call(t)

  svg.append('circle')
    .style('fill', t.url())
}

export {setForViz}
