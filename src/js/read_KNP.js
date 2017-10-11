/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from '../csv2Array.js'

import {getCSV} from './getCSV.js'
import {reconstruct_KNP} from './reconstruct_KNP.js'

import {find_character} from './find_character.js'

import {createNodeAndArrowArray} from './createNodeAndArrowArray.js'

import {manageSlider} from './characterChart/slider.js'

let characterArray = []

let verbArray = []


let read_KNP = () => {

  let KNP_array = csv2Array('../csv/1707051018knptab.csv')
  console.log(KNP_array)

  let nodeArray=[]
  find_character(KNP_array, characterArray,nodeArray)
  console.log(nodeArray)

  let reconstructedKNP = reconstruct_KNP(KNP_array, characterArray, nodeArray)
  console.log('get out reconstruct_KNP')
  console.log(reconstructedKNP.sentenceArray)

  createNodeAndArrowArray(reconstructedKNP, nodeArray)
  manageSlider(reconstructedKNP.sentenceArray)
}


let find_dependency = () => {
  find_subject()
  find_object()
}

let find_subject = () => {

}

let find_object = () => {

}

export {read_KNP}
