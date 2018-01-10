import { rodata } from '../rodata'

const readAnsRadio = (jsonFileName, storage, ansBunAnd1stCateArr, answerRadioResult, taiou, ansChBoxLen, isUsingDictionaryWithWord2Vec) => {
  let graphNumber = 2

  var c
  for (c = 1; c <= ansChBoxLen; c++) {
    let changedAnswerClassificationSaveTarget

    if (isUsingDictionaryWithWord2Vec === 1) {
      changedAnswerClassificationSaveTarget = jsonFileName + 'AnswerWithNewDictionary' + c
      // 今後辞書名に対応
    } else {
      changedAnswerClassificationSaveTarget = jsonFileName + 'RGB' + c
    }

    const answerRadio = document.getElementById('r' + c).children
    for (let i = answerRadio.length - rodata.ansRadioFullLen, l = answerRadio.length; i < l; i++) {
      if (answerRadio[i].control.checked === true) {
        if (answerRadio[i].control.value === '1') {
          answerRadioResult[taiou[c - 1]] = 1
          storage.setItem(changedAnswerClassificationSaveTarget, 0)
          break
        } else if (answerRadio[i].control.value === '2') {
          answerRadioResult[taiou[c - 1]] = 2
          storage.setItem(changedAnswerClassificationSaveTarget, 1)
          break
        } else if (answerRadio[i].control.value === '3') {
          answerRadioResult[taiou[c - 1]] = 3
          storage.setItem(changedAnswerClassificationSaveTarget, 2)
          break
        } else if (answerRadio[i].control.value === '4') {
          answerRadioResult[taiou[c - 1]] = 4
          storage.setItem(changedAnswerClassificationSaveTarget, 3)
          console.log(ansBunAnd1stCateArr[taiou[c-1]][0])
          break
        } else if (answerRadio[i].control.value === '5') {
          answerRadioResult[taiou[c - 1]] = 5
          storage.setItem(changedAnswerClassificationSaveTarget, 4)
          break
        }
      } else {
        answerRadioResult[taiou[c - 1]] = 0
        storage.setItem(changedAnswerClassificationSaveTarget, 9)// 未分類
      }
    }
  }
}

export {readAnsRadio}