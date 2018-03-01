import d3 from 'd3'
import { charaChartRodata } from '../rodata'

const vizBarChart=(strArr,svg,barLenArr,fullW,axisShiftX,chartShiftX)=>{

  //let axisShiftX = 68
  console.log(barLenArr)

  var xScale = d3.scale.linear()
    .domain([0, d3.sum(barLenArr) / 10])
    .range([axisShiftX, fullW - axisShiftX])

  let tooltip = d3.select("body").select("#tooltip")
 // let row = 0// graph3の行番号
  // 階層構造をとるため，g要素を生成する部分とrect要素を生成している部分が連続している．

  var dataArr = [
    barLenArr,
    barLenArr
  ]

  svg.selectAll('g')
    .data(dataArr)
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
      console.log(i)
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
      return xScale(subSum) / 10 + 10 + chartShiftX
    })
    .attr('y', 10)
    .attr('width', function (d) {
      // var sum = d3.sum(barLenArr);
      return xScale(d) / 10
    })
    .attr('height', 20)
    .attr('fill', function (d, i) {
      return '#a0a0a0'
      //     if ((row === 0 && isFullConversationAnsArr[i] === 0) || (row === 1 && isFullConversationAnsArr[i] === 1)) {
      /*        if (i + 1 === barTxtArr.length) {
                row++
              }*/
      //return barChartAllHatsugenCArr[i] //質問の場合はtextureを使いたい
      //一個の関数にして振り分けたい（配列やreturnはまずそう）

      /*if(/*answer){
        //moyou
      }else{
        //questionColor
      }*/

/*      switch (i%2) {
        case 0:
          return '#a0a0a0'
          break
        default:
          return '#f0f0f0'
          break
      }*/
      /*        }
            } else {
              if (i + 1 === barTxtArr.length) {
                row++
              }
              return barChartBGColor
            }*/
    })
/*    .on("mouseover", function(d,rectNo){
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
    .on("mouseout", function(d){return tooltip.style("visibility", "hidden");})*/

}

export {vizBarChart}