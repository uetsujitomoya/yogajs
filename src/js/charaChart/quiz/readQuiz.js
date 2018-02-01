import { createTxtBoxInBox } from '../viewText/createTxtBoxInBox'

const readQuiz=()=>{

  let nowQuizArr=[]

  nowQuizArr.forEach((quiz,idx)=>{
    createTxtBoxInBox(idx)
    writeQuiz()
  })
}

const writeQuiz=()=>{

}

export {readQuiz}