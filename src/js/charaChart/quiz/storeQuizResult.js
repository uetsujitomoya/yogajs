const radioFullLen=5

const storeQuizResult=(quizResultArr,quizNo,time)=>{

  const answerRadio = document.getElementById('r' + chBoxNo).children

  let ans

  for (let buttonNo = answerRadio.length - radioFullLen, l = answerRadio.length; buttonNo < l; buttonNo++) {
    if (answerRadio[buttonNo].control.checked) {
      ans = answerRadio[buttonNo].control.value
      break
    }
  }

  quizResultArr.add([quizNo,ans,time])
}

export {storeQuizResult}