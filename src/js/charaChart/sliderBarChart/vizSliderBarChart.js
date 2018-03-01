import * as d3 from 'd3'
import { charaChartRodata } from '../rodata'
import { vizBarChart } from './vizBarChart'
import { borderBunNoArr } from './borderBunNoArr'

const vizSliderBarChart=()=>{
  //svg

  console.log("vizSliderBarChart")

  const fullW=charaChartRodata.sliderBarChart.fullW
  let svg = d3.select(charaChartRodata.sliderBarChart.id).append('svg')
    .attr({
      width: charaChartRodata.sliderBarChart.fullW,
      height: charaChartRodata.sliderBarChart.h
    })
  //add四角
  console.log(svg)
  vizBarChart(["hoge","hoge","hoge","hoge","hoge"],svg,borderBunNoArr,fullW,0,0)
  const barLenArr=borderBunNoArr
  const strArr=["hoge","hoge","hoge","hoge","hoge"]
  const axisShiftX=0
  const chartShiftX=charaChartRodata.sliderBarChart.chartShiftX

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
    .data(function (d) {
      console.log(d)
      return d
    })
    .enter()
    .append('rect')// 四角追加
    .attr('x', function (d, i) {
      console.log(i)
      var arr = barLenArr
      // var sum = d3.sum(arr);
      var subSum = d3.sum(i === 0 ? [] : arr.slice(0, i))
      return xScale(subSum) / 10 + 10 + chartShiftX
    })
    .attr('y', 10)
    .attr('width', function (d) {
      //console.log(i)
      // var sum = d3.sum(barLenArr);
      return xScale(d) / 10
    })
    .attr('height', 20)
    .attr('fill', function (d, i) {
      console.log(i)
      switch (i%2) {
        case 0:
          return '#a0a0a0'
          break
        default:
          return '#f0f0f0'
          break
      }

    })
    .on("mouseover", function(d,rectNo){

      console.log(strArr[rectNo])

        return tooltip.style("visibility", "visible").text(strArr[rectNo]);

    })//吹き出し
    .on("mousemove", function(d){return tooltip.style("top", (event.pageY-20)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(d){return tooltip.style("visibility", "hidden");})

}

export {vizSliderBarChart}