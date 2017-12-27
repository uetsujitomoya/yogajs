import { viewQuestionTxt } from './viewQuestionTxt'
import { viewAnswerTxt } from './viewAnswerTxt'

const viewOnlyTxt = (m, hatsugenArr, allHatsugenNoArr, bun2dArr, ansTextureChoiceArr, ansCategoryNoArr, allQueHatsugenColorArr) => {
  for(let hatsugenNo=0; hatsugenNo<hatsugenArr.length; hatsugenNo++){
    console.log(hatsugenNo)
    viewQuestionTxt(m,allHatsugenNoArr,hatsugenNo,allQueHatsugenColorArr,hatsugenArr)
    hatsugenNo++
    if(hatsugenNo<hatsugenArr.length){
      console.log(hatsugenNo)
      viewAnswerTxt({
        m:m,
        txtViewHatsugenNo:0,
        allHatsugenIdxArr:allHatsugenNoArr,
        hatsugenNo:hatsugenNo,
        bun:bun2dArr,
        ansTextureChoiceArr:ansTextureChoiceArr,
        ansCategoryNoArr:ansCategoryNoArr
      })
    }else{
      break
    }
  }
}

export {viewOnlyTxt}

//m,0,allHatsugenNoArr,hatsugenNo,bun2dArr,ansTextureChoiceArr,ansCategoryNoArr