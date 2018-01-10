import { rodata } from '../rodata'

const fromAnsRadioResultToAnsCateNum = (ansCateNumArr, ansRadioResult, keitaisokaiseki, ansBunAnd1stCateArr, RGBlist, bun) => {

  console.log(ansRadioResult) //合ってる
  console.log(ansBunAnd1stCateArr) //合ってる
  console.log(RGBlist)

  //下記、総当りで検索してたのか。。→同じ文に対して同じ分類が当てはまる。。それはあかんわ。。→単純にansRadioResultCntを足す方式に変更。
  let ansRadioResultCnt = 1

  let RGBlistCnt = 0// allHatsugenNo=1;allHatsugenNo<keitaisokaiseki.length;allHatsugenNo=allHatsugenNo+2の外
  for (let allHatsugenNo = 1; allHatsugenNo < keitaisokaiseki.length; allHatsugenNo = allHatsugenNo + 2) {//何故か各発言内1文多い
    ansCateNumArr[allHatsugenNo] = []// svgでの描画ではm→hatsugenBunNo
    for (let hatsugenBunNo = 0; hatsugenBunNo < keitaisokaiseki[allHatsugenNo].length - rodata.keitaisokaisekiHatugenBunQtyGap; hatsugenBunNo++) {
      ansCateNumArr[allHatsugenNo][hatsugenBunNo] = 0
      //for (let ansRadioResultCnt = 1; ansRadioResultCnt < ansBunAnd1stCateArr.length; ansRadioResultCnt++) {
      //if (bun[allHatsugenNo][hatsugenBunNo] === ansBunAnd1stCateArr[ansRadioResultCnt][0]) {
      console.log("%d発言目内 %d文目",allHatsugenNo,hatsugenBunNo)
      console.log("ansRadioResultCnt %d",ansRadioResultCnt)

      const tmpAnsRadioResult = ansRadioResult[ansRadioResultCnt - 1] //1-5
      console.log("tmpAnsRadioResult",tmpAnsRadioResult)

      RGBlist[RGBlistCnt][tmpAnsRadioResult-1] = RGBlist[RGBlistCnt][tmpAnsRadioResult] + 1 //ここ意味わからん
      ansCateNumArr[allHatsugenNo][hatsugenBunNo] = tmpAnsRadioResult

      /*          if (ansRadioResult[ansRadioResultCnt - 1] === 1) {
                  RGBlist[RGBlistCnt][0] = RGBlist[RGBlistCnt][0] + 1
                  ansCateNumArr[allHatsugenNo][hatsugenBunNo] = 1
                } else if (ansRadioResult[ansRadioResultCnt - 1] === 2) {
                  RGBlist[RGBlistCnt][1] = RGBlist[RGBlistCnt][1] + 1
                  ansCateNumArr[allHatsugenNo][hatsugenBunNo] = 2
                } else if (ansRadioResult[ansRadioResultCnt - 1] === 3) {
                  RGBlist[RGBlistCnt][2] = RGBlist[RGBlistCnt][2] + 1
                  ansCateNumArr[allHatsugenNo][hatsugenBunNo] = 3
                } else */

      //if (ansRadioResult[ansRadioResultCnt - 1] === 4) {
      //console.log(ansBunAnd1stCateArr[ansRadioResultCnt][0])
      //}
      /*else if (ansRadioResult[ansRadioResultCnt - 1] === 5) {
        RGBlist[RGBlistCnt][4] = RGBlist[RGBlistCnt][4] + 1
        ansCateNumArr[allHatsugenNo][hatsugenBunNo] = 5
      }*/

      //}
      ansRadioResultCnt++
      //}
    }
    RGBlistCnt++
  }
}

//const

export{fromAnsRadioResultToAnsCateNum}