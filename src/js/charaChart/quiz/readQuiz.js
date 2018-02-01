import { createTxtBoxInBox } from '../viewText/createTxtBoxInBox'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { setting } from '../setting'
import { reloadGraph } from './reloadGraph'
import { outputQuizResultCsv } from './outputQuizResultCsv'
import { storeQuizResult } from './storeQuizResult'
import { nodeCnt } from '../nodeAndArrow/defineNode'

const quizArr=csv2Arr(setting.quiz.path)
const questionQty=5
let quizNo=1

const quizNoCol=0
const knpCsvCol=1
const bunArrCsvCol=2
const isFixedCol=3
const isColoredCol=4
const queBunCol=5
const choiceStartCol=6

let quizResultArr=[]

const readQuiz=(quizNo)=>{

  //No
  //knpCsv
  //bunArrCsv
  //fix
  //color
  //question

  let nowQuizArr=[]

  reloadGraph(quizArr[quizNo])

  //nowQuizArr.forEach((quiz,idx)=>{
  let msg = document.getElementById('box')
  msg.innerHTML=''
  createTxtBoxInBox(0)

  writeQuiz(quizNo)
  //})
  var start_ms = new Date().getTime();
  /*
  計測したい処理
  */



  document.getElementById('msg0').onchange = () => {
    var time = new Date().getTime() - start_ms;
    storeQuizResult(quizResultArr,quizNo,time)
    quizNo++
    console.log(quizNo)
    console.log(quizArr.length)
    if(quizNo<5){
      setting.nodeCnt=0
      readQuiz(quizNo)
    }else{
      const inputForOutput={
        answerer:{
          name:null,
          age:null,
          sex:null,
        },
        quizResultArr:quizResultArr
      }
      //outputQuizResultCsv(inputForOutput)
      outputQuizResultCsv(quizResultArr)
    }
  }



}

const writeQuiz=()=>{


  //createTxtBoxInBox(0)
  writeQuestion(quizNo)
  //writeChoice
}

const writeQuestion=(quizNo)=>{
  const quizRow=quizArr[quizNo]
  const queBun=quizRow[queBunCol]

  document.getElementById('msg0').innerHTML+=quizArr[quizNo][1]
  let target = document.getElementById('msg0')
  target.innerHTML += '<div id="b' + quizNo + '" style="cursor: pointer"><u>' +  queBun + '</u></div><div id="r' + quizNo + '"><label></label></div><br>'

  for(let colCnt=choiceStartCol;colCnt<quizRow.length;colCnt++){
    const chBun=quizRow[colCnt]
    const targetInRow = document.getElementById('r' + quizNo)
    targetInRow.innerHTML += '<label><input type=radio name="r' + colCnt + '" value=' + colCnt + '>'+chBun+'</label>'

  }


}

const createAnswerRadioButtonRow = (answerNumber, value, color, answerGroupName) => {
  const targetInRow = document.getElementById('r' + answerNumber)
  targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>　'
}


const writeChoice=()=>{

}

export {readQuiz}