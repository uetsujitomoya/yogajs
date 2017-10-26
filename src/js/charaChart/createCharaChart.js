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

let charaArr = []

let verbArr = []

const createCharaChart = () => {

  let knpArr = csv2Array(rodata.csvPath)

  let nodeArr=[]
  findChara(knpArr, charaArr, nodeArr)

  fixNodePoint(charaArr)
  fixNodePoint(nodeArr)

  console.log(charaArr)
  console.log(nodeArr)

  let reconstructedKNP = createBunArr(knpArr, charaArr, nodeArr)

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