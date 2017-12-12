/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Arr} from '../manageCsv/csv2Arr.js'
import {getCSV} from '../manageCsv/getCSV.js'
import {createBunArr} from './createBunArr/createBunArr.js'
import {findChara} from './chara/findChara.js'
import {createArrowArr} from './nodeAndArrow/createArrowArr.js'
import {manageSlider} from './viz/slider.js'
import {fixNodePoint} from './chara/fixNodePoint'
import {searchMaenoBunForShugo} from './createBunArr/SO/searchMaenoBunForS'
import {saveBunArrJson} from './saveBunArrJson'

import { downloadJson } from './downloadJson'

import {rodata} from './rodata'
import {downloadAsTask} from './downloadAsTask'
import { outputCsv } from './csv/outputCsv'

let nodeArr = []

let verbArr = []

const createCharaChart = () => {

  const knp = csv2Arr(rodata.csvPath)

  //console.log(knp)

  let nodeArr=[]
  findChara(knp, nodeArr)

  fixNodePoint(nodeArr)

  const bunArr = createBunArr(knp, nodeArr)

  //downloadAsTask(bunArr)
  //outputCsv(bunArr)

  createArrowArr(bunArr, nodeArr,bunArr)
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