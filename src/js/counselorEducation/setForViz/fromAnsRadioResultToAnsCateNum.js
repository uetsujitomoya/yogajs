const fromAnsRadioResultToAnsCateNum = (ansCategoryNumArr,ansRadioResult,keitaisokaiseki,ansBunAnd1stCateArr,RGBlist,bun) => {

  console.log(ansRadioResult)
  console.log(ansBunAnd1stCateArr)
  console.log(RGBlist)

  let RGBlistCnt = 0// allHatsugenNo=1;allHatsugenNo<keitaisokaiseki.length;allHatsugenNo=allHatsugenNo+2の外
  for (let allHatsugenNo = 1; allHatsugenNo < keitaisokaiseki.length; allHatsugenNo = allHatsugenNo + 2) {
    ansCategoryNumArr[allHatsugenNo] = []// svgでの描画ではm→hatsugenBunNo
    for (let hatsugenBunNo = 0; hatsugenBunNo < keitaisokaiseki[allHatsugenNo].length; hatsugenBunNo++) {
      ansCategoryNumArr[allHatsugenNo][hatsugenBunNo] = 0
      for (let ansRadioResultCnt = 1; ansRadioResultCnt < ansBunAnd1stCateArr.length; ansRadioResultCnt++) {
        if (bun[allHatsugenNo][hatsugenBunNo] === ansBunAnd1stCateArr[ansRadioResultCnt][0]) {

          const tmpAnsRadioResult = ansRadioResult[ansRadioResultCnt - 1] //1-5

          RGBlist[RGBlistCnt][tmpAnsRadioResult-1] = RGBlist[RGBlistCnt][tmpAnsRadioResult] + 1
          ansCategoryNumArr[allHatsugenNo][hatsugenBunNo] = tmpAnsRadioResult

          /*          if (ansRadioResult[ansRadioResultCnt - 1] === 1) {
                      RGBlist[RGBlistCnt][0] = RGBlist[RGBlistCnt][0] + 1
                      ansCategoryNumArr[allHatsugenNo][hatsugenBunNo] = 1
                    } else if (ansRadioResult[ansRadioResultCnt - 1] === 2) {
                      RGBlist[RGBlistCnt][1] = RGBlist[RGBlistCnt][1] + 1
                      ansCategoryNumArr[allHatsugenNo][hatsugenBunNo] = 2
                    } else if (ansRadioResult[ansRadioResultCnt - 1] === 3) {
                      RGBlist[RGBlistCnt][2] = RGBlist[RGBlistCnt][2] + 1
                      ansCategoryNumArr[allHatsugenNo][hatsugenBunNo] = 3
                    } else */

          if (ansRadioResult[ansRadioResultCnt - 1] === 4) {
            console.log(ansBunAnd1stCateArr[ansRadioResultCnt][0])
          }
          /*else if (ansRadioResult[ansRadioResultCnt - 1] === 5) {
            RGBlist[RGBlistCnt][4] = RGBlist[RGBlistCnt][4] + 1
            ansCategoryNumArr[allHatsugenNo][hatsugenBunNo] = 5
          }*/

        }
      }
    }
    RGBlistCnt++
  }
}

//const

export{fromAnsRadioResultToAnsCateNum}