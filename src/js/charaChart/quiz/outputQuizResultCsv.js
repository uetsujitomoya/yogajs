import { downloadAsCSV } from '../../manageCsv/downloadAsCsv'
import { now } from '../../getDate'

const outputQuizResultCsv=(input)=>{

  //1行目：
  //3行目：
  //2列目：パスワード

  let quizResultCsvArr=[]

  quizResultCsvArr.push([,input.answerer.name,input.answerer.age,input.answerer.sex])
  quizResultCsvArr.push(["quizNo","answer","time"])


/*  for(const quiz of input.quizResultArr){
    quizResultCsvArr.add()
  }*/

  input.quizResultArr.forEach((quizResult,idx)=>{
    quizResultCsvArr.push([idx,quizResult.answer,quizResult.time])
  })

  downloadAsCSV(input.answerer.name+"_" +now,quizResultCsvArr)

}

export {outputQuizResultCsv}