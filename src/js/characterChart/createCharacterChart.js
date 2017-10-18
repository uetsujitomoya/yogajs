/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from '../../csv2Array.js'
import {getCSV} from '../getCSV.js'
import {reconstructKNP} from '../reconstructKNP.js'
import {find_character} from './findCharacter.js'
import {createNodeAndArrowArray} from './nodeAndArray/createNodeAndArrowArray.js'
import {manageSlider} from './slider.js'
import {fixNodePoint} from './fixNodePoint'

let characterArray = []

let verbArray = []

const createCharacterChart = () => {

  let KNP_array = csv2Array('../csv/1707051018knptab.csv')
  console.log(KNP_array)

  let nodeArray=[]
  find_character(KNP_array, characterArray, nodeArray)
  console.log(nodeArray)

  fixNodePoint(nodeArray)

  let reconstructedKNP = reconstructKNP(KNP_array, characterArray, nodeArray)
  console.log('get out reconstructKNP')
  console.log(reconstructedKNP.sentenceArray)

  createNodeAndArrowArray(reconstructedKNP.sentenceArray, nodeArray)
  manageSlider(reconstructedKNP.sentenceArray)
}

const find_dependency = () => {
  find_subject()
  find_object()
}

let find_subject = () => {

}

let find_object = () => {

}

export {createCharacterChart}