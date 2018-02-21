import { barChartRodata } from '../rodata'

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

    const ansRadio = document.getElementById('r' + chBoxNo).children
    console.log(ansRadio)
    for (let buttonNo = ansRadio.length - barChartRodata.ansRadioFullLen, l = ansRadio.length; buttonNo < l; buttonNo++) {
      if (ansRadio[buttonNo].control.checked) {
        //console.log("ansRadio[buttonNo].control.value")
        //console.log(ansRadio[buttonNo].control.value)
        if (ansRadio[buttonNo].control.value === '1') {
          answerRadioResult[taiou[chBoxNo - 1]] = 1
          storage.setItem(changedAnswerClassificationSaveTarget, 0)
          break
        } else if (ansRadio[buttonNo].control.value === '2') {
          answerRadioResult[taiou[chBoxNo - 1]] = 2
          storage.setItem(changedAnswerClassificationSaveTarget, 1)
          break
        } else if (ansRadio[buttonNo].control.value === '3') {
          answerRadioResult[taiou[chBoxNo - 1]] = 3
          storage.setItem(changedAnswerClassificationSaveTarget, 2)
          break
        } else if (ansRadio[buttonNo].control.value === '4') {
          answerRadioResult[taiou[chBoxNo - 1]] = 4
          storage.setItem(changedAnswerClassificationSaveTarget, 3)
          //console.log(ansBunAnd1stCateArr[taiou[chBoxNo]][0])
          break
        } else if (ansRadio[buttonNo].control.value === '5') {
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