const radioFullLen=5
const radio1stNo=1
const brNo=1

const storeQuizResult=(quizResultArr,quizNo,time)=>{

  console.log('r' + quizNo)
  const answerRadio = document.getElementById('r1').children

  console.log(answerRadio)
  let ans

  for (let buttonNo = radio1stNo; buttonNo < answerRadio.length; buttonNo=buttonNo+1+brNo) {

    if (answerRadio[buttonNo].control.checked) {
      ans = answerRadio[buttonNo].control.value
      break
    }
  }

  console.log(quizResultArr)

  quizResultArr.push([quizNo,ans,time])
}

export {storeQuizResult}