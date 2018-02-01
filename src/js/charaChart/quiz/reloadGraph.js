import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'

const reloadGraph=(quizRow)=>{
  if(quizRow[rodata.quiz.isFixedCol]==="true"){
    rodata.isFixedArrowWidth=true
    rodata.isFixedCircleR=true
  }else{
    rodata.isFixedArrowWidth=false
    rodata.isFixedCircleR=false
  }

  if(quizRow[rodata.quiz.isColoredCol]==="true"){
    rodata.
  }

}

export{reloadGraph}