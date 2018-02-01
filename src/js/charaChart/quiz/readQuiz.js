import { createTxtBoxInBox } from '../viewText/createTxtBoxInBox'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { rodata } from '../rodata'
import { reloadGraph } from './reloadGraph'
import { outputQuizResultCsv } from './outputQuizResultCsv'
import { storeQuizResult } from './storeQuizResult'

const quizArr=csv2Arr(rodata.quiz.path)
let quizNo=1

const quizNoCol=0
const knpCsvCol=1
const bunArrCsvCol=2
const isFixedCol=3
const isColoredCol=4
const queBunCol=5
const choiceStartCol=6
const readQuiz=(quizNo)=>{

  //No
  //knpCsv
  //bunArrCsv
  //fix
  //color
  //question

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
  document.getElementById('msg0').onchange = () => {
    storeQuizResult
    if(quizNo<=quizArr){
      readQuiz(quizNo)
    }else{
      outputQuizResultCsv(input)
    }
  }



}

const writeQuiz=()=>{


  createTxtBoxInBox(0)
  writeQuestion()
  writeChoice
}

const writeQuestion=(quizNo)=>{
  const quizRow=quizArr[quizNo]
  const queBun=quizRow[queBunCol]

  document.getElementById('msg0').innerHTML+=quizArr[quizNo][1]
  let target = document.getElementById('msg0')
  target.innerHTML += '<div id="b' + ansCnt + '" style="cursor: pointer"><u>' + (hatsugenIdx + 1) + '(C) ' + bun[hatsugenIdx][bunIdx] + '</u></div><div id="r' + ansCnt + '"><label><input type=radio name="r' + ansCnt + '" value=0>どれにも含まない</label></div><br>'

  for(let col=choiceStartCol;col<quizRow.length;col++){

    targetInRow.innerHTML += '<label><input type=radio name="r' + col + '" value=' + col + '>'+queBun+'</label>'

  }


}

const createAnswerRadioButtonRow = (answerNumber, value, color, answerGroupName) => {
  const targetInRow = document.getElementById('r' + answerNumber)
  targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>'
}


const writeChoice=()=>{

}

export {readQuiz}