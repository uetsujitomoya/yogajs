/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from '../csv2Array.js'

import {getCSV} from './getCSV.js'
import {reconstruct_KNP} from './reconstruct_KNP.js'

import {find_character} from './find_character.js'

import {createNodeAndArrowArray} from './createNodeAndArrowArray.js'

import {manageSlider} from './characterChart/slider.js'

let KNP_character_array = []

let KNP_verb_array = []


let read_KNP = () => {
  let knparray = csv2Array('../csv/1707051018knptab.csv')
  console.log(knparray)
  let nodeArray=[]
  find_character(knparray, KNP_character_array,nodeArray)
  //console.log(KNP_character_array)
  console.log(nodeArray)

    // organize_KNPresult()

    // find_verb(knparray);
    // console.log(KNP_verb_array)
    // if verb was found,
  let reconstructedKNP = reconstruct_KNP(knparray, KNP_character_array,nodeArray)
  console.log('get out reconstruct_KNP')
  console.log(reconstructedKNP.sentenceArray)

  createNodeAndArrowArray(reconstructedKNP)
  manageSlider(reconstructedKNP.sentenceArray)

    // find_dependency();
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
