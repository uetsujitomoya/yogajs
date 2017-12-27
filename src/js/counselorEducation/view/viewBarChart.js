import d3 from 'd3'

const viewBarChart=(ranshinNoArr,ranshinStrArr)=>{
  let ranshinStrArrCnt = 0
  for (let hatsugenNo = 1; hatsugenNo < ranshinNoArr.length; hatsugenNo = hatsugenNo + 2) {
    for (let bunNo = 0; bunNo < ranshinNoArr[hatsugenNo].length; bunNo++) {
      ranshinStrArr[ranshinStrArrCnt] = ''
      if (ranshinNoArr[hatsugenNo][bunNo][0] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '病\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][1] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '無気\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][2] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '疑\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][3] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '不注\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][4] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '怠\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][5] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '渇\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][6] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '妄想\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][7] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '新境\n'
      }
      if (ranshinNoArr[hatsugenNo][bunNo][8] === 1) {
        ranshinStrArr[ranshinStrArrCnt] = '落着'
      }
      ranshinStrArrCnt++
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

      if (checked[checkedNo] === 0) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.noGroup; checkedNo++
      } else if (checked[checkedNo] === 1) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.love; checkedNo++
      } else if (checked[checkedNo] === 2) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.friendship; checkedNo++
      } else if (checked[checkedNo] === 3) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.work; checkedNo++
      } else if (checked[checkedNo] === 4) {
        rextTxt[rectTxtNo] = categoryOfTextOnRect.self; checkedNo++
      } else if (checked[checkedNo] === 5) {
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

    .on('mouseover', function (d, i) {
        var msg = document.getElementById('msg')
        let txtViewHatsugenNo, l
        msg.innerHTML = ''
        if (isFullConversationAnswerArr[i] === 0) {    // カウンセラーのグラフを触った時
          for (txtViewHatsugenNo = -3; txtViewHatsugenNo <= 3; txtViewHatsugenNo++) {
            if (allHatsugenNoArr[i] + txtViewHatsugenNo < 0 || allHatsugenNoArr[i] + txtViewHatsugenNo >= hatsugenArr.length) {
              continue
            }
            if (txtViewHatsugenNo === 0) {
              msg.innerHTML += '<b><u><font size=' + fontSizeInTextView + '>' + (1 + allHatsugenNoArr[i]) + '' + txtViewCounselor + ' <font color=' + allQuestionHatsugenColorArr[allHatsugenNoArr[i] / 2] + '>【</font>' + hatsugenArr[allHatsugenNoArr[i]] + '<font color=' + allQuestionHatsugenColorArr[allHatsugenNoArr[i] / 2] + '>】</font></u></b><font size=' + fontSizeInTextView + '><br><br>'
            } else if (txtViewHatsugenNo % 2 === 0) {
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + allHatsugenNoArr[i]) + '' + txtViewCounselor + ' <font color=' + allQuestionHatsugenColorArr[txtViewHatsugenNo / 2 + allHatsugenNoArr[i] / 2] + '><b>【</b></font>' + hatsugenArr[txtViewHatsugenNo + allHatsugenNoArr[i]] + '<font color=' + allQuestionHatsugenColorArr[txtViewHatsugenNo / 2 + allHatsugenNoArr[i] / 2] + '><b>】</b></font><br><br>'
            } else { // forループを回さないと各文ごとの表示ができない
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + allHatsugenNoArr[i]) + '' + clientInTextView + ' '
              for (l = 0; l < bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]].length; l++) {
                if (bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l] === '') { continue }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l]] + '><b>【</b></font>' + bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l]] + '><b>】</b></font>'
              }
              msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br>'
            }
          }
        } else {  // 患者のグラフを触った時
          for (txtViewHatsugenNo = -3; txtViewHatsugenNo <= 3; txtViewHatsugenNo++) {
            if (allHatsugenNoArr[i] + txtViewHatsugenNo < 0 || allHatsugenNoArr[i] + txtViewHatsugenNo >= hatsugenArr.length) {
              continue
            }
            if (txtViewHatsugenNo === 0) {
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + allHatsugenNoArr[i]) + '' + clientInTextView + ' '
              for (l = 0; l < bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]].length; l++) {
                if (bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l] === '') { continue }
                msg.innerHTML += '<u><font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l]] + '><b>【</b></font>' + bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l]] + '><b>】</b></font></font></u>'
              }
              msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br></font>'
            } else if (txtViewHatsugenNo % 2 === 0) {
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + allHatsugenNoArr[i]) + '' + clientInTextView + ' '
              for (l = 0; l < bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]].length; l++) {
                if (bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l] === '') { continue }
                msg.innerHTML += '<font size=' + fontSizeInTextView + '><font color=' + answerTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l]] + '><b>【</b></font>' + bun2dArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l] + '<font color=' + answerTextureChoiceArr[ansCategoryNoArr[txtViewHatsugenNo + allHatsugenNoArr[i]][l]] + '><b>】</b></font>'
              }
              msg.innerHTML += '<font size=' + fontSizeInTextView + '><br><br>'
            } else { // forループを回さないと各文ごとの表示ができない
              msg.innerHTML += '<font size=' + fontSizeInTextView + '>' + (1 + txtViewHatsugenNo + allHatsugenNoArr[i]) + '' + txtViewCounselor + ' <font color=' + allQuestionHatsugenColorArr[txtViewHatsugenNo / 2 + allHatsugenNoArr[i] / 2] + '><b>【</b></font>' + hatsugenArr[txtViewHatsugenNo + allHatsugenNoArr[i]] + '<font color=' + allQuestionHatsugenColorArr[txtViewHatsugenNo / 2 + allHatsugenNoArr[i] / 2] + '><b>】</b></font><br><br>'
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
}

export {viewBarChart}