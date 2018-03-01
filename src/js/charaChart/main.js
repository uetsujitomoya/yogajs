/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Arr} from '../manageCsv/csv2Arr.js'
import {getCSV} from '../manageCsv/getCSV.js'
import {createBunArr} from './createBunArr/main.js'
import {findChara} from './chara/findChara.js'
import {createArrowArr} from './nodeAndArrow/createArrowArr.js'
import {manageSlider} from './slider.js'
import {fixNodePoint} from './chara/fixNodePoint'
import {searchMaenoBunForShugo} from './createBunArr/SO/searchMaenoBunForS'
import {saveBunArrJson} from './saveBunArrJson'
import { downloadJson } from './downloadJson'
import {charaChartRodata} from './rodata'
import {downloadAsTask} from './downloadAsTask'
import { outputBunArrCsv } from './csv/outputBunArrCsv'
import { inputBunArrCsv } from './csv/inputBunArrCsv'
import {applySlider} from './slider'
import { fromCsvTxt2Arr } from './csv/getCSVFile'
import { vizSliderBarChart } from './sliderBarChart/vizSliderBarChart'

let nodeArr = []
let verbArr = []

const mainOfCharaChart = (knpCsv,bunArrCsv) => {
  //const knpArr = csv2Arr(barChartRodata.knpCsvFolder+barChartRodata.knpCsvName+".csv")
  const knpArr = fromCsvTxt2Arr(knpCsv)
  //console.log(knpArr)
  let nodeArr=[]
  findChara(knpArr, nodeArr)
  fixNodePoint(nodeArr)
  const bunArr = createBunArr(knpArr, nodeArr)
  //outputBunArrCsv(bunArr)
  inputBunArrCsv(bunArr,bunArrCsv)
  if(charaChartRodata.isSingleSlider&&charaChartRodata.checkBoxCommentOut){
    const selectedArea = {
      start: 0,
      end: 0+charaChartRodata.singleSliderSelectLen
    }
    applySlider(selectedArea, bunArr,nodeArr)
  }else{
    createArrowArr(bunArr, nodeArr,bunArr)
  }

  vizSliderBarChart()
  manageSlider(bunArr,nodeArr)
}


export {mainOfCharaChart}