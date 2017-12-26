import { viewQuestionTxt } from './viewQuestionTxt'
import { viewAnswerTxt } from './viewAnswerTxt'

const viewOnlyText = (m,hatsugenArr,allHatsugenNoArr,bunArr,ansTextureChoiceArr,ansCategoryNoArr,allQueHatsugenColorArr) => {
  for(let hatsugenNo=0; hatsugenNo<hatsugenArr.length; hatsugenNo++){
    viewQuestionTxt(m,allHatsugenNoArr,hatsugenNo,allQueHatsugenColorArr)
    hatsugenNo++
    if(hatsugenNo<hatsugenArr.length){
      viewAnswerTxt(m,0,allHatsugenNoArr,hatsugenNo,bunArr,ansTextureChoiceArr,ansCategoryNoArr)
      hatsugenNo++
    }else{
      break
    }
  }
}

export {viewOnlyText}