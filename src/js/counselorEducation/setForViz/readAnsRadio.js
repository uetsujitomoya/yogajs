import { rodata } from '../rodata'

const readAnsRadio = (jsonFileName, storage, ansBunAnd1stCateArr, answerRadioResult, taiou, ansChBoxLen, isUsingDictionaryWithWord2Vec) => {
  let graphNumber = 2


  for (let chBoxNo = 1; chBoxNo <= ansChBoxLen; chBoxNo++) {

    let changedAnswerClassificationSaveTarget

    if (isUsingDictionaryWithWord2Vec === 1) {
      changedAnswerClassificationSaveTarget = jsonFileName + 'AnswerWithNewDictionary' + chBoxNo
      // 今後辞書名に対応
    } else {
      changedAnswerClassificationSaveTarget = jsonFileName + 'RGB' + chBoxNo
    }

    //console.log(changedAnswerClassificationSaveTarget) //json縮小時の差分を見る

    const answerRadio = document.getElementById('r' + chBoxNo).children
    for (let buttonNo = answerRadio.length - rodata.ansRadioFullLen, l = answerRadio.length; buttonNo < l; buttonNo++) {
      if (answerRadio[buttonNo].control.checked) {
        //console.log("answerRadio[buttonNo].control.value")
        //console.log(answerRadio[buttonNo].control.value)
        if (answerRadio[buttonNo].control.value === '1') {
          answerRadioResult[taiou[chBoxNo - 1]] = 1
          storage.setItem(changedAnswerClassificationSaveTarget, 0)
          break
        } else if (answerRadio[buttonNo].control.value === '2') {
          answerRadioResult[taiou[chBoxNo - 1]] = 2
          storage.setItem(changedAnswerClassificationSaveTarget, 1)
          break
        } else if (answerRadio[buttonNo].control.value === '3') {
          answerRadioResult[taiou[chBoxNo - 1]] = 3
          storage.setItem(changedAnswerClassificationSaveTarget, 2)
          break
        } else if (answerRadio[buttonNo].control.value === '4') {
          answerRadioResult[taiou[chBoxNo - 1]] = 4
          storage.setItem(changedAnswerClassificationSaveTarget, 3)
          //console.log(ansBunAnd1stCateArr[taiou[chBoxNo]][0])
          break
        } else if (answerRadio[buttonNo].control.value === '5') {
          answerRadioResult[taiou[chBoxNo - 1]] = 5
          storage.setItem(changedAnswerClassificationSaveTarget, 4)
          break
        }
      } else {
        answerRadioResult[taiou[chBoxNo - 1]] = 0
        storage.setItem(changedAnswerClassificationSaveTarget, 9)// 未分類
      }
    }
  }
}

export {readAnsRadio}