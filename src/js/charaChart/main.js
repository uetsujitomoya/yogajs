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
import {charaChartSetting} from './setting'
import {downloadAsTask} from './downloadAsTask'
import { outputBunArrCsv } from './csv/outputBunArrCsv'
import { inputBunArrCsv } from './csv/inputBunArrCsv'
import {applySlider} from './slider'
import { fromCsvTxt2Arr } from './csv/getCSVFile'

let nodeArr = []
let verbArr = []

const mainOfCharaChart = (knpCsv,bunArrCsv,isToOutputBunArr) => {
  charaChartSetting.nodeCnt=0
  //const knpArr = csv2Arr(charaChartSetting.knpCsvFolder+charaChartSetting.knpCsvName+".csv")
  const knpArr = fromCsvTxt2Arr(knpCsv)
  //console.log(knpArr)
  let nodeArr=[]
  findChara(knpArr, nodeArr)
  fixNodePoint(nodeArr)
  const bunArr = createBunArr(knpArr, nodeArr)
  if(isToOutputBunArr){
    outputBunArrCsv(bunArr)
  }else{
    inputBunArrCsv(bunArr,bunArrCsv)
  }

  if(charaChartSetting.isSingleSlider&&charaChartSetting.checkBoxCommentOut){
    const selectedArea = {
      start: 0,
      end: 0+charaChartSetting.singleSliderSelectLen
    }
    applySlider(selectedArea, bunArr,nodeArr)
  }else{
    createArrowArr(bunArr, nodeArr,bunArr)
  }


  manageSlider(bunArr,nodeArr)
}


export {mainOfCharaChart}