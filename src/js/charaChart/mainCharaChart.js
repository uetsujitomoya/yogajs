/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Arr} from '../manageCsv/csv2Arr.js'
import {getCSV} from '../manageCsv/getCSV.js'
import {createBunArr} from './createBunArr/createBunArr.js'
import {findChara} from './chara/findChara.js'
import {createArrowArr} from './nodeAndArrow/createArrowArr.js'
import {manageSlider} from './slider.js'
import {fixNodePoint} from './chara/fixNodePoint'
import {searchMaenoBunForShugo} from './createBunArr/SO/searchMaenoBunForS'
import {saveBunArrJson} from './saveBunArrJson'
import { downloadJson } from './downloadJson'
import {setting} from './setting'
import {downloadAsTask} from './downloadAsTask'
import { outputCsv } from './csv/outputCsv'
import { inputCsv } from './csv/inputCsv'
import {applySlider} from './slider'
import { readKnp } from './csv/readKnp'



const createCharaChart = (knpCsvName,bunArrCsvName) => {
  let nodeArr = []
  let verbArr = []
  let knp=csv2Arr(setting.knpCsvFolder+knpCsvName+".csv")
  //readKnp(knpCsvName,knp)
  console.log(knp)

  findChara(knp, nodeArr)
  fixNodePoint(nodeArr)
  const bunArr = createBunArr(knp, nodeArr)
  //outputCsv(bunArr)
  inputCsv(bunArr,bunArrCsvName)
  if(setting.isSingleSlider&&setting.isCheckBoxCommentOut){
    const selectedArea = {
      start: 0,
      end: 0+setting.singleSliderSelectLen
    }
    applySlider(selectedArea, bunArr,nodeArr)
  }else{
    createArrowArr(bunArr, nodeArr,bunArr)
  }


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