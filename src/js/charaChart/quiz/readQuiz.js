import { createTxtBoxInBox } from '../viewText/createTxtBoxInBox'
import { csv2Arr } from '../../manageCsv/csv2Arr'
import { setting } from '../setting'
import { reloadGraph } from './reloadGraph'
import { outputQuizResultCsv } from './outputQuizResultCsv'
import { storeQuizResult } from './storeQuizResult'
import { nodeCnt } from '../nodeAndArrow/defineNode'

const quizArr=csv2Arr(setting.quiz.path)
const questionQty=27
//let quizNo=1

const quizNoCol = setting.quiz.quizNoCol
const knpCsvCol = setting.quiz.knpCsvCol
const bunArrCsvCol = setting.quiz.bunArrCsvCol
const isFixedCol = setting.quiz.isFixedCol
const isColoredCol = setting.quiz.isColoredCol
const queBunCol = setting.quiz.queBunCol
const choiceStartCol = setting.quiz.choiceStartCol

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
  let quizBigBox = document.getElementById('quiz')
  quizBigBox.innerHTML=''
  createTxtBoxInBox("Q","quiz")

  writeQuiz(quizNo)
  //})
  var start_ms = new Date().getTime();
  /*
  計測したい処理
  */



  document.getElementById('msgQ').onchange = () => {
    var time = new Date().getTime() - start_ms;
    storeQuizResult(quizResultArr,quizNo,time)
    quizNo++
    console.log(quizNo)
    console.log(quizArr.length)
    if(quizNo<questionQty){
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

const writeQuiz=(quizNo)=>{

  //createTxtBoxInBox(0)
  writeQuestion(quizNo)
  //writeChoice
}

const writeQuestion=(quizNo)=>{
  const quizRow=quizArr[quizNo]
  const queBun=quizRow[queBunCol]

  //問題番号
  document.getElementById('msgQ').innerHTML+="<font size='5'><b>Q"+quizArr[quizNo][setting.quiz.quizNoCol]+"</b></font>"

  let target = document.getElementById('msgQ')
  target.innerHTML += '<div id="b' + quizNo + '" style="cursor: pointer">ある登場人物から別の登場人物への言動について，<b><u>' +  queBun + '</u></b>文目の中で最も多いのは誰から誰への言動ですか？</div><div id="r1"><label></label></div><br>'

  for(let colCnt=choiceStartCol;colCnt<quizRow.length;colCnt++){
    const chBun=quizRow[colCnt]
    const targetInRow = document.getElementById('r1')
    targetInRow.innerHTML += '<label><input type=radio name="r' + colCnt + '" value=' + colCnt + '>'+chBun+'</label><br>'
  }
}

const createAnswerRadioButtonRow = (answerNumber, value, color, answerGroupName) => {
  const targetInRow = document.getElementById('r' + answerNumber)
  targetInRow.innerHTML += '<label><input type=radio name="r' + answerNumber + '" value=' + value + '><font color="' + color + '">【</font>「' + answerGroupName + '」に含む<font color="' + color + '">】</font></label>　'
}


const writeChoice=()=>{

}

export {readQuiz}