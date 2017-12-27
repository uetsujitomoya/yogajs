import { viewQuestionTxt } from './viewQuestionTxt'
import { viewAnswerTxt } from './viewAnswerTxt'

const viewOnlyTxt = (m, hatsugenArr, rectHatsugenNoArr, bun2dArr, ansTextureChoiceArr, ansCategoryNoArr, allQueHatsugenColorArr) => {

  console.log(ansTextureChoiceArr)
  console.log(ansCategoryNoArr)
  console.log(allQueHatsugenColorArr)

  for(let hatsugenNo=0; hatsugenNo<hatsugenArr.length; hatsugenNo++){

    //colorGray(ansTextureChoiceArr,ansCategoryNoArr,allQueHatsugenColorArr)


    viewQuestionTxt(m,rectHatsugenNoArr,hatsugenNo,allQueHatsugenColorArr,hatsugenArr,true)
    hatsugenNo++
    if(hatsugenNo<hatsugenArr.length){

      viewAnswerTxt({
        m:m,
        txtViewHatsugenNo:0,
        allHatsugenIdxArr:rectHatsugenNoArr,
        hatsugenNo:hatsugenNo,
        bun:bun2dArr,
        ansTextureChoiceArr:ansTextureChoiceArr,
        ansCategoryNoArr:ansCategoryNoArr,
        isToViewOnlyTxt:true
      })
    }else{
      break
    }
  }
}

const colorGray={

}

export {viewOnlyTxt}

//m,0,allHatsugenNoArr,hatsugenNo,bun2dArr,ansTextureChoiceArr,ansCategoryNoArr