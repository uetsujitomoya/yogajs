/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import Node from '../js/defineNodeClass.js'
import Arrow from '../js/defineArrowClass.js'
import {vizNodes} from '../js/vizNode'
import {initialValueOfSubjectAndObjectInVerb} from './createNodeAndArrowArray.js'

let createNodeAndArrowArray = (sentenceArray) => {
    // console.log("entered createNodeArrowarray")
    // console.log(sentenceArray)
  let arrowArray = []
  let nodeArray = []
  console.log(arrowArray.length)
    // KNP_sentence_array.forEach((sentence)=>{
  for (let sentenceNum = 0; sentenceNum < sentenceArray.length; sentenceNum++) {
    let sentence = sentenceArray[sentenceNum]
        // console.log(sentence)

    let containsVerbArray = {
      value: 'verb_array' in sentence ? sentence.verb_array : 'No'
    }

    if (containsVerbArray.value == 'No') { continue }

    sentence.verb_array.forEach((verb) => {
      if (existsObject(verb)) {
        let isNewArrow = true
        for (let tempArrowNum = 0; tempArrowNum < arrowArray.length; tempArrowNum++) {
          if (isSameArrow(arrowArray[tempArrowNum], verb)) {
            arrowArray[tempArrowNum].arrowStrokeWidth++
            isNewArrow = false
            break
          }
        }
        if (isNewArrow) {
          arrowArray.push(new Arrow(verb))
        }
      } else if (existsSubject(verb)) {
        let isNewNode = true
        for (let tempNodeNum = 0; tempNodeNum < nodeArray.length; tempNodeNum++) {
          if (isSameNode(nodeArray[tempNodeNum], verb)) {
            nodeArray[tempNodeNum].circleStrokeWidth++
            isNewNode = false
            break
          }
        }
        if (isNewNode) {
          nodeArray.push(new Node(verb))
        }
      }
    })
  }

  console.log(nodeArray)
  console.log(arrowArray)
  vizNodes(nodeArray)
}

let isSameArrow = (arrow, verb) => {
    // console.log(arrow)
  if ((arrow.subject == verb.subject) && (arrow.object == verb.object)) {
    return true
  } else {
    return false
  }
}

let isSameNode = (node, verb) => {
    // console.log(node)
    // console.log(verb)
  if (node.subject == verb.subject) {
    return true
  } else {
    return false
  }
}

let existsObject = (verb) => {
    // console.log(verb)
  if (verb.object == initialValueOfSubjectAndObjectInVerb) {
    return false
  } else {
    return true
  }
}

let existsSubject = (verb) => {
    // console.log("enter existsSubject")
    // console.log(verb.subject)
  if (verb.subject == initialValueOfSubjectAndObjectInVerb) {
    return false
  } else {
        // alert("exist Node!")
    return true
  }
}

let createNode = () => {

}

let createArrow = () => {

}

export {createNodeAndArrowArray}
