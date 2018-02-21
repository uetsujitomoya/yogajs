import { isKihonkuIncludingTheVerb } from './isKihonkuIncludingTheVerb'

const defineBunVerbBunHtml = (bun)=> {
  //原文表示に用いる
  console.log("defineBunVerbBunHtml.js")

  bun.verbArr.forEach((verb)=>{

    //やっぱり基本句から取っていく
    bun.kihonkuArr.forEach((kihonku)=>{
      //console.log(kihonku)
      if(isKihonkuIncludingTheVerb(kihonku,verb)){ //基本句のknpArrからsearch
        this.bunHtml += "<u><b>"
      }
      this.bunHtml += kihonku.surfaceForm

      if(isKihonkuIncludingTheVerb(kihonku,verb)){
        this.bunHtml += "</b></u>"
      }
    })

  })


}

export {defineBunVerbBunHtml}