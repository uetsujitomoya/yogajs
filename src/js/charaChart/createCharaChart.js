/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from '../csv2Array.js'
import {getCSV} from '../counselorEdu/getCSV.js'
import {createBunArr} from './createBunArr/createBunArr.js'
import {findChara} from './findChara.js'
import {createNodeAndArrowArr} from './nodeAndArrow/createArrowArr.js'
import {manageSlider} from './viz/slider.js'
import {fixNodePoint} from './fixNodePoint'
import {searchMaenoBunForShugo} from './createBunArr/SO/searchMaenoBunForS'
import{rodata} from './rodata'

let nodeArr = []

let verbArr = []

const createCharaChart = () => {

  let knpArr = csv2Array(rodata.csvPath)

  let nodeArr=[]
  findChara(knpArr, nodeArr)

  fixNodePoint(nodeArr)
  fixNodePoint(nodeArr)

  console.log(nodeArr)
  console.log(nodeArr)

  let reconstructedKNP = createBunArr(knpArr, nodeArr)

  createNodeAndArrowArr(reconstructedKNP.sentenceArray, nodeArr)
  manageSlider(reconstructedKNP.sentenceArray,nodeArr)
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