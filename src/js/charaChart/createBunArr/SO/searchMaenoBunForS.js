const searchMaenoBunForShugo = (bunArr, bunNo, verbNo,bun)=>{
  //まずその分から探す
  for(let verbCnt = verbNo - 1 ; verbCnt >= 0 ; verbCnt-- ){
    const maenodoushi = bun.verb_array[verbCnt]
    if(maenodoushi.hasSubject){
      bun.verb_array[verbNo].rewriteSubject(maenodoushi.subject)
      console.log(bun.verb_array[verbNo])
      return
    }
  }

  //次にそれより前の文から探す
  for(let bunCnt = bunNo - 1 ; bunCnt >= 0 ; bunCnt-- ){
    if(Object.keys(bunArr[bunCnt]).length!==0){
      for(let verbCnt=bunArr[bunCnt].verb_array.length - 1; verbCnt >= 0 ; verbCnt--){
        const maenodoushi = bunArr[bunCnt].verb_array[verbCnt]
        if(maenodoushi.hasSubject){
          bun.verb_array[verbNo].rewriteSubject(maenodoushi.subject)
          console.log(bun.verb_array[verbNo])
          console.log("has both S & O!")
          return
        }
      }
    }
  }
}

export {searchMaenoBunForShugo}