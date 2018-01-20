/**
 * Created by uetsujitomoya on 2017/09/04.
 */

//import Node from './defineNode.js'
import Arrow from './defineArrow.js'
import {vizNodes} from './vizNode'
import {initialValueOfSubjectAndObjectInVerb} from '../createBunArr/isVerb.js'
import {definePointArr} from './connectNodeAndArrow'
import {rodata} from '../rodata'
import * as d3 from 'd3'
import {vizArrow} from './vizArrow'
import {nowWatchingArrowOrNode} from '../nowWatchingArrowOrNode'
import { viewArrowTxt } from '../viewText/viewArrowTxt'

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
              nodeArr[tmpNodeCnt].circleStrokeWidth++
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
  let svg = d3.select(rodata.charaChartAreaID).append('svg')
    .attr({
      width: rodata.svgWidth,
      height: rodata.svgHeight
    })
  const r = (rodata.orbitR * rodata.circleRadiusCoefficient) / nodeArr.length
  vizNodes(svg,nodeArr,sliderBunArr,r,allBunArr)

  arrowArr.forEach((arrow,arrowId)=>{
    definePointArr(arrow)

    vizArrow(svg, arrow, r,arrowId,allBunArr)
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
