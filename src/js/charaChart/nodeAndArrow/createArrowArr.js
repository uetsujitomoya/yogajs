/**
 * Created by uetsujitomoya on 2017/09/04.
 */

//矢印配列をつくり，人間関係図を描画する

//import Node from './Node.js'
import Arrow from './Arrow.js'
import {vizNodes} from './vizNodes'
import {initialValueOfSubjectAndObjectInVerb} from '../createBunArr/isVerb.js'
import {definePointArr} from './connectNodeAndArrow'
import {charaChartRodata} from '../rodata'
import * as d3 from 'd3'
import {vizArrow} from './vizArrow'
import {nowWatchingArrowOrNode} from '../nowWatchingArrowOrNode'
import { viewArrowTxt } from '../viewText/viewArrowTxt'
import { borderBunNoArr } from '../sliderBarChart/borderBunNoArr'

const createArrowArr = (sliderBunArr, nodeArr, allBunArr) => {
  let arrowArr = []
  resetCircleStrokeWidth(nodeArr)
  for (let bunCnt = 0; bunCnt < sliderBunArr.length; bunCnt++) {
    const bun = sliderBunArr[bunCnt]
    const hasVerbArr = {
      value: 'verbArr' in bun ? bun.verbArr : 'No'
    }
    if (hasVerbArr.value === 'No') { continue }
    bun.verbArr.forEach((verb) => {
      if (verb.hasSubject) {
        if ( (verb.hasObject) && ( verb.subject.name!==verb.object.name ) ) {
          let isNewArrow = true
          for (let tmpArrowCnt = 0; tmpArrowCnt < arrowArr.length; tmpArrowCnt++) {
            if (isSameArrow(arrowArr[tmpArrowCnt], verb)) {
              arrowArr[tmpArrowCnt].addStrokeWidth(bun,verb)
              isNewArrow = false
              break
            }
          }
          if (isNewArrow) {
            arrowArr.push(new Arrow(verb,bun))
          }
        }else{
          for (let tmpNodeCnt = 0; tmpNodeCnt < nodeArr.length; tmpNodeCnt++) {
            if (isSameNode(nodeArr[tmpNodeCnt], verb)) {
              //nodeArr[tmpNodeCnt].circleStrokeWidth++
              nodeArr[tmpNodeCnt].updatePropaties(verb.isBlueCircleColor)
              break
            }
          }
        }
      }
    })
  }
  if(nowWatchingArrowOrNode.arrow!==null){
    for(const arrow of arrowArr){
      if(arrow.subject.name===nowWatchingArrowOrNode.arrow.subject && arrow.object.name===nowWatchingArrowOrNode.arrow.object){
        viewArrowTxt(arrow,allBunArr)
        break
      }
    }
  }
  let svg = d3.select(charaChartRodata.charaChartAreaID).append('svg')
    .attr({
      width: charaChartRodata.svgWidth,
      height: charaChartRodata.svgHeight
    })

  console.log(svg)
  const r = (charaChartRodata.orbitR * charaChartRodata.circleRadiusCoefficient) / nodeArr.length
  vizNodes(svg,nodeArr,sliderBunArr,r,allBunArr)

  arrowArr.forEach((arrow,arrowId)=>{
    definePointArr(arrow)

    vizArrow(svg, arrow, r,arrowId,allBunArr)
  })

  const fullW=charaChartRodata.sliderBarChart.fullW
  const barLenArr=borderBunNoArr
  const strArr=["hoge","hoge","hoge","hoge","hoge"]
  const axisShiftX=0
  const chartShiftX=0

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
      console.log(i)
      // var sum = d3.sum(barLenArr);
      return xScale(d) / 10
    })
    .attr('height', 20)
    .attr('fill', function (d, i) {
      console.log(i)
      return '#a0a0a0'

    })
}

const isSameArrow = (arrow, verb) => {
  if ((arrow.subject.name === verb.subject.name) && (arrow.object.name === verb.object.name)) {
    return true
  } else {
    return false
  }
}

const isSameNode = (node, verb) => {
  if (node.name === verb.subject.name) {
    return true
  } else {
    return false
  }
}

const existsObject = (verb) => {
  if (verb.object === initialValueOfSubjectAndObjectInVerb) {
    return false
  } else {
    return true
  }
}

const existsSubject = (verb) => {
  if (verb.subject === initialValueOfSubjectAndObjectInVerb) {
    return false
  } else {
    return true
  }
}

const resetCircleStrokeWidth=(nodeArray)=>{
  for(let node of nodeArray){
    node.circleStrokeWidth=0
  }
}

export {createArrowArr}
