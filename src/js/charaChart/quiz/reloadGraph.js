import { csv2Arr } from '../../manageCsv/csv2Arr'
import { roColorSet, setting } from '../setting'
import { createCharaChart } from '../mainCharaChart'
import { removeSVG } from '../nodeAndArrow/vizNode'

const reloadGraph=(quizRow)=>{
  if(quizRow[setting.quiz.isFixedCol]===setting.quiz.csvTrue){
    setting.isFixedArrowWidth=true
    setting.isFixedCircleR=true
  }else{
    setting.isFixedArrowWidth=false
    setting.isFixedCircleR=false
  }

  if(quizRow[setting.quiz.isColoredCol]===setting.quiz.csvTrue){
    setting.clientArrowColor=roColorSet.vivid.garnet
    setting.aroundClientPeopleArrowColor=roColorSet.vivid.orange
    setting.kawaisounaClientArrowColor=roColorSet.vivid.blue
    setting.situationDependencyPeopleColor=roColorSet.vivid.green
  }else{
    setting.clientArrowColor=roColorSet.boxBorderColor
    setting.aroundClientPeopleArrowColor=roColorSet.boxBorderColor
    setting.kawaisounaClientArrowColor=roColorSet.boxBorderColor
    setting.situationDependencyPeopleColor=roColorSet.boxBorderColor
  }

  removeSVG()

  createCharaChart(quizRow[setting.quiz.knpCsvCol],quizRow[setting.quiz.bunArrCsvCol])



}

export{reloadGraph}