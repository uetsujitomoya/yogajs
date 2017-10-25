/**
 * Created by uetsujitomoya on 2017/09/04.
 */

//import Node from './defineNode.js'
import Arrow from './defineArrow.js'
import {vizNodes} from './vizNode'
import {initialValueOfSubjectAndObjectInVerb} from '../createBunArr/defineVerb.js'
import {connectNodeAndArray} from './connectNodeAndArrow'

//let initialValueOfSubjectAndObjectInVerb

const createNodeAndArrowArr = (bunArray, nodeArr) => {
    // console.log("entered createNodeArrowarray")
    // console.log(bunArray)
  let arrowArr = []
  //let nodeArr = []
  console.log(arrowArr.length)

  resetCircleStrokeWidth(nodeArr)

  for (let bunCnt = 0; bunCnt < bunArray.length; bunCnt++) {
    let bun = bunArray[bunCnt]
        // console.log(bun)

    let containsVerbArray = {
      value: 'verb_array' in bun ? bun.verb_array : 'No'
    }

    if (containsVerbArray.value === 'No') { continue }

    //console.log(bun.verb_array)

    bun.verb_array.forEach((verb) => {

      if (existsSubject(verb)) {
        console.log(verb)
        if (existsObject(verb)) {
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
          //let isNewNode = true
          for (let tmpNodeCnt = 0; tmpNodeCnt < nodeArr.length; tmpNodeCnt++) {
            if (isSameNode(nodeArr[tmpNodeCnt], verb)) {
              console.log('same node!')
              //console.log(circleStrokeWidth)
              console.log(verb)
              nodeArr[tmpNodeCnt].circleStrokeWidth++
              console.log(nodeArr[tmpNodeCnt].circleStrokeWidth)
              //isNewNode = false
              break
            }
          }
          /*if (isNewNode) {
            nodeArr.push(new Node(verb))
          }*/
        }

      }
    })
  }

  console.log(nodeArr)
  console.log(arrowArr)

  vizNodes(nodeArr,arrowArr)
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
