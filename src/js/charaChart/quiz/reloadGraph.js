import { csv2Arr } from '../../manageCsv/csv2Arr'
import { roColorSet, setting } from '../setting'

const reloadGraph=(quizRow)=>{
  if(quizRow[setting.quiz.isFixedCol]==="true"){
    setting.isFixedArrowWidth=true
    setting.isFixedCircleR=true
  }else{
    setting.isFixedArrowWidth=false
    setting.isFixedCircleR=false
  }

  if(quizRow[setting.quiz.isColoredCol]==="true"){
    setting.clientArrowColor=roColorSet.vivid.garnet
    setting.aroundClientPeopleArrowColor=roColorSet.vivid.orange
    setting.kawaisounaClientArrowColor=roColorSet.vivid.blue
    setting.situationDependencyPeopleColor=roColorSet.vivid.green
  }

}

export{reloadGraph}