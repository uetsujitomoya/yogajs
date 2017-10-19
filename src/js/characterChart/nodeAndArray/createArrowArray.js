/**
 * Created by uetsujitomoya on 2017/09/04.
 */

//import Node from './defineNode.js'
import Arrow from './defineArrow.js'
import {vizNodes} from './vizNode'
import {initialValueOfSubjectAndObjectInVerb} from '../reconstructKNP/defineVerb.js'
import {connectNodeAndArray} from './connectNodeAndArray'

//let initialValueOfSubjectAndObjectInVerb

const createNodeAndArrowArray = (sentenceArray, nodeArray) => {
    // console.log("entered createNodeArrowarray")
    // console.log(sentenceArray)
  let arrowArray = []
  //let nodeArray = []
  console.log(arrowArray.length)

  resetCircleStrokeWidth(nodeArray)

  for (let sentenceCnt = 0; sentenceCnt < sentenceArray.length; sentenceCnt++) {
    let sentence = sentenceArray[sentenceCnt]
        // console.log(sentence)

    let containsVerbArray = {
      value: 'verb_array' in sentence ? sentence.verb_array : 'No'
    }

    if (containsVerbArray.value === 'No') { continue }

    //console.log(sentence.verb_array)

    sentence.verb_array.forEach((verb) => {

      if (existsSubject(verb)) {
        console.log(verb)
        if (existsObject(verb)) {
          let isNewArrow = true
          for (let tmpArrowCnt = 0; tmpArrowCnt < arrowArray.length; tmpArrowCnt++) {
            if (isSameArrow(arrowArray[tmpArrowCnt], verb)) {
              arrowArray[tmpArrowCnt].arrowStrokeWidth++
              isNewArrow = false
              break
            }
          }
          if (isNewArrow) {
            arrowArray.push(new Arrow(verb))
          }
        }else{
          //let isNewNode = true
          for (let tmpNodeCnt = 0; tmpNodeCnt < nodeArray.length; tmpNodeCnt++) {
            if (isSameNode(nodeArray[tmpNodeCnt], verb)) {
              console.log('same node!')
              //console.log(circleStrokeWidth)
              console.log(verb)
              nodeArray[tmpNodeCnt].circleStrokeWidth++
              console.log(nodeArray[tmpNodeCnt].circleStrokeWidth)
              //isNewNode = false
              break
            }
          }
          /*if (isNewNode) {
            nodeArray.push(new Node(verb))
          }*/
        }

      }
    })
  }

  console.log(nodeArray)
  //console.log(arrowArray)

  vizNodes(nodeArray,arrowArray)
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
  for(let node of nodeArray){
    node.circleStrokeWidth=0
  }
}

export {createNodeAndArrowArray}
