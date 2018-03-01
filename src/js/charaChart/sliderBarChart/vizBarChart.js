import d3 from 'd3'

const vizBarChart=(strArr)=>{

  let tooltip = d3.select("body").select("#tooltip")
  let row = 0// graph3の行番号
  // 階層構造をとるため，g要素を生成する部分とrect要素を生成している部分が連続している．
  svg.selectAll('g')
    .data(strArr)
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
      var arr = barLenArr
      // var sum = d3.sum(arr);
      var subSum = d3.sum(i === 0 ? [] : arr.slice(0, i))
      return xScale(subSum) / 10 + 10 + graphShiftX
    })
    .attr('y', 10)
    .attr('width', function (d) {
      // var sum = d3.sum(barLenArr);
      return xScale(d) / 10
    })
    .attr('height', 20)
    .attr('fill', function (d, i) {
      if ((row === 0 && isFullConversationAnsArr[i] === 0) || (row === 1 && isFullConversationAnsArr[i] === 1)) {
        if (i + 1 === barTxtArr.length) {
          row++
        }
        //return barChartAllHatsugenCArr[i] //質問の場合はtextureを使いたい
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
        if (i + 1 === barTxtArr.length) {
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
    .on("mouseover", function(d,rectNo){
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
    .on("mousemove", function(d){return tooltip.style("top", (event.pageY-20)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(d){return tooltip.style("visibility", "hidden");})

}

export {vizBarChart}