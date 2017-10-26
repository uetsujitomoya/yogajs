/**
 * Created by uetsujitomoya on 2017/09/04.
 */

//import Node from './defineNode.js'
import Arrow from './defineArrow.js'
import {vizNodes} from './vizNode'
import {initialValueOfSubjectAndObjectInVerb} from '../createBunArr/defineVerb.js'
import {connectNodeAndArrow} from './connectNodeAndArrow'
import {rodata} from '../rodata'

import {vizArrow} from './vizArrow'

const createNodeAndArrowArr = (bunArr, nodeArr) => {
  let arrowArr = []

  resetCircleStrokeWidth(nodeArr)

  for (let bunCnt = 0; bunCnt < bunArr.length; bunCnt++) {
    let bun = bunArr[bunCnt]
    let containsVerbArray = {
      value: 'verb_array' in bun ? bun.verb_array : 'No'
    }
    if (containsVerbArray.value === 'No') { continue }

    bun.verb_array.forEach((verb) => {

      if (verb.hasSubject) {
        if (verb.hasObject) {
          let isNewArrow = true
          for (let tmpArrowCnt = 0; tmpArrowCnt < arrowArr.length; tmpArrowCnt++) {
            if (isSameArrow(arrowArr[tmpArrowCnt], verb)) {
              arrowArr[tmpArrowCnt].arrowStrokeWidth++
              isNewArrow = false
              break
            }
          }
          if (isNewArrow) {
            arrowArr.push(new Arrow(verb))
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


  let svg = d3.select(rodata.characterChartAreaID).append('svg')
    .attr({
      width: 1300,
      height: 800
    })

  vizNodes(svg,nodeArr,arrowArr,bunArr)

  console.log(arrowArr)

  for(let arrow of arrowArr){
    connectNodeAndArrow(arrow)
    vizArrow(svg, arrow.pointArray)
  }


}

const isSameArrow = (arrow, verb) => {
    // console.log(arrow)
  if ((arrow.subject === verb.subject) && (arrow.object === verb.object)) {
    return true
  } else {
    return false
  }
}

const isSameNode = (node, verb) => {
    //console.log(node)
    // console.log(verb)
  if (node.name === verb.subject.name) {
    return true
  } else {
    return false
  }
}

const existsObject = (verb) => {
    // console.log(verb)
  if (verb.object === initialValueOfSubjectAndObjectInVerb) {
    return false
  } else {
    return true
  }
}

const existsSubject = (verb) => {
    // console.log("enter existsSubject")
    // console.log(verb.subject)
  if (verb.subject === initialValueOfSubjectAndObjectInVerb) {
    return false
  } else {
        // alert("exist Node!")
    return true
  }
}

const resetCircleStrokeWidth=(nodeArray)=>{
  //slider用
  for(let node of nodeArray){
    node.circleStrokeWidth=0
  }
}

export {createNodeAndArrowArr}
