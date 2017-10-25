const searchMaenoBunForShugo = (bunArr, bunNo, verbNo,bun)=>{
  console.log("verbNo=%d",verbNo)

  //まずその分から探す
  for(let verbCnt = verbNo - 1 ; verbCnt === 0 ; verbCnt-- ){
    console.log(verbCnt)
    const maenodoushi = bun.verb_array[verbCnt]
    console.log(maenodoushi)
    if(maenodoushi.hasSubject){
      bun.verb_array[verbNo].subject=maenodoushi.subject
      console.log(bun.surfaceForm)
      return
    }
  }

  //次にそれより前の文から探す
  for(let bunCnt = bunNo - 1 ; bunCnt === 0 ; bunCnt-- ){
    for(let verbCnt=bunArr[bunCnt].verb_array.length - 1; verbCnt=0; verbCnt--){
      console.log(maenodoushi)
      const maenodoushi = bunArr[bunCnt].verb_array[verbCnt]
      if(maenodoushi.hasSubject){
        bun.verb_array[verbNo].subject=maenodoushi.subject
        console.log(bun.surfaceForm)
        return
      }
    }
  }
}

export {searchMaenoBunForShugo}