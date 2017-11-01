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
import {saveBunArrJson} from './saveBunArrJson'

import { downloadJson } from './downloadJson'

import {rodata} from './rodata'
import {downloadTask} from './downloadTask'

let nodeArr = []

let verbArr = []

const createCharaChart = () => {

  const knp = csv2Arr(rodata.csvPath)

  console.log(knp)

  let nodeArr=[]
  findChara(knp, nodeArr)

  fixNodePoint(nodeArr)

  const bunArr = createBunArr(knp, nodeArr)

  downloadTask(bunArr)

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