import { createTxtBoxInBox } from '../viewText/createTxtBoxInBox'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'
import { reloadGraph } from './reloadGraph'

const readQuiz=()=>{



  let nowQuizArr=[]

  reloadGraph

  nowQuizArr.forEach((quiz,idx)=>{
    createTxtBoxInBox(idx)
    writeQuiz()
  })
  var start_ms = new Date().getTime();
  /*
  計測したい処理
  */
  var elapsed_ms = new Date().getTime() - start_ms;
}

const writeQuiz=()=>{

  writeQuestion()
  writeChoice
}

const writeQuestion=()=>{

}


const writeChoice=()=>{

}

export {readQuiz}