import { readQuiz } from './readQuiz'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'
import { outputQuizResultCsv } from './outputQuizResultCsv'

const quizMain=()=>{

  const quizArr=csv2Arr(rodata.quiz.path)
  for(let quizNo=1; quizNo<=quizArr.length;quizNo++){
    selectViz()
    readQuiz
  }
  outputQuizResultCsv


}

export {quizMain}