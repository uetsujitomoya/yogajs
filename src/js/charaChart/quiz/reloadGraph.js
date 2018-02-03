import { csv2Arr } from '../../manageCsv/csv2Arr'
import { roColorSet, setting } from '../setting'
import { createCharaChart } from '../mainCharaChart'
import { removeSVG } from '../nodeAndArrow/vizNode'
import { redrawCharaChart } from '../redrawCharaChart'

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
    setting.aroundClientPeopleArrowColor=roColorSet.vivid.blue
    setting.kawaisounaClientArrowColor=roColorSet.vivid.garnet
    setting.situationDependencyPeopleColor=roColorSet.vivid.blue
  }else{
    setting.clientArrowColor=roColorSet.boxBorderColor
    setting.aroundClientPeopleArrowColor=roColorSet.boxBorderColor
    setting.kawaisounaClientArrowColor=roColorSet.boxBorderColor
    setting.situationDependencyPeopleColor=roColorSet.boxBorderColor
  }

  if(quizRow[setting.quiz.isArrowCol]===setting.quiz.csvTrue){
    setting.isViewedMarkEnd=true
  }else{
    setting.isViewedMarkEnd=false
  }

  removeSVG()

  let bunAndNodeArrObj=createCharaChart(quizRow[setting.quiz.knpCsvCol],quizRow[setting.quiz.bunArrCsvCol])

  removeSVG()

  redrawCharaChart(
    bunAndNodeArrObj.bunArr,
    {
      start : parseInt( quizRow[ setting.quiz.queStartBunNoCol ] ),
      end : parseInt( quizRow[ setting.quiz.queStartBunNoCol ] ) + setting.singleSliderSelectLen
    },
    bunAndNodeArrObj.nodeArr
  )

}

export{reloadGraph}