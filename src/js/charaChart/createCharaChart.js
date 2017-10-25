/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from '../counselorEdu/csv2Array.js'
import {getCSV} from '../counselorEdu/getCSV.js'
import {createBunArr} from './createBunArr/createBunArr.js'
import {findChara} from './findChara.js'
import {createNodeAndArrowArr} from './nodeAndArrow/createArrowArray.js'
import {manageSlider} from './viz/slider.js'
import {fixNodePoint} from './fixNodePoint'
import {searchMaenoBunForShugo} from './createBunArr/SO/searchMaenoBunForS'
import{rodata} from './rodata'

let charaArr = []

let verbArr = []

const createCharaChart = () => {

  let knpArr = csv2Array(rodata.csvPath)
  console.log(knpArr)

  let nodeArr=[]
  findChara(knpArr, charaArr, nodeArr)
  console.log(nodeArr)

  fixNodePoint(charaArr)

  let reconstructedKNP = createBunArr(knpArr, charaArr, nodeArr)
  console.log('get out createBunArr')
  console.log(reconstructedKNP.sentenceArray)

  createNodeAndArrowArr(reconstructedKNP.sentenceArray, charaArr)
  manageSlider(reconstructedKNP.sentenceArray,charaArr)
}

const findDependency = () => {
  find_subject()
  find_object()
}

let find_subject = () => {

}

let find_object = () => {

}

export {createCharaChart}