import { readQuiz } from './readQuiz'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'
import { outputQuizResultCsv } from './outputQuizResultCsv'

const quizMain=()=>{

  const quizArr=csv2Arr(rodata.quiz.path)
  for(let quizNo=1; quizNo<=quizArr.length;quizNo++){

    //ポジネガ問題
    //何文目〜何文目において，誰と誰との間の言動が最も多いか？
    //何文目〜何文目において，誰から誰への言動が最も多いか？
    //何文目〜何文目において，誰と誰との間のpositive/negativeな言動が最も多いか？
    //何文目〜何文目において，誰から誰へのpositive/negativeな言動が最も多いか？
    selectViz()
    readQuiz
  }
  outputQuizResultCsv


}

export {quizMain}