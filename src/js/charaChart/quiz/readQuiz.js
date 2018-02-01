import { createTxtBoxInBox } from '../viewText/createTxtBoxInBox'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'
import { reloadGraph } from './reloadGraph'
import { outputQuizResultCsv } from './outputQuizResultCsv'

const quizArr=csv2Arr(rodata.quiz.path)
let quizNo=1
const readQuiz=(quizNo)=>{



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

  quizNo++
  document.getElementById('radio_buttons').onchange = () => {
    if(quizNo<=quizArr){
      readQuiz(quizNo)
    }else{
      outputQuizResultCsv(input)
    }
  }



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