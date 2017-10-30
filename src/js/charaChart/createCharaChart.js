/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Arr} from '../csv2Arr.js'
import {getCSV} from '../counselorEdu/getCSV.js'
import {createBunArr} from './createBunArr/createBunArr.js'
import {findChara} from './chara/findChara.js'
import {createNodeAndArrowArr} from './nodeAndArrow/createArrowArr.js'
import {manageSlider} from './viz/slider.js'
import {fixNodePoint} from './chara/fixNodePoint'
import {searchMaenoBunForShugo} from './createBunArr/SO/searchMaenoBunForS'
import{rodata} from './rodata'

let nodeArr = []

let verbArr = []

const createCharaChart = () => {

  let knpArr = csv2Arr(rodata.csvPath)

  let nodeArr=[]
  findChara(knpArr, nodeArr)

  fixNodePoint(nodeArr)

  const bunArr = createBunArr(knpArr, nodeArr)

  createNodeAndArrowArr(bunArr, nodeArr)
  manageSlider(bunArr,nodeArr)
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