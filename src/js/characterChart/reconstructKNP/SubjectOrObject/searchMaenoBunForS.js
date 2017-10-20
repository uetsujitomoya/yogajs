const searchMaenoBunForShugo = (bunArray, bunNo, verbNo)=>{
  //まずその分から探す
  for(let verbCnt=verbNo;verbCnt=0;verbCnt--){
    const maenodoushi = bunArray[bunNo].verb_array[verbCnt]
    if(maenodoushi.hasSubject){
      bunArray[bunNo].verb_array[verbNo].subject=maenodoushi.subject
      return
    }
  }

  //次にそれより前の文から探す
  for(let bunCnt=bunNo-1;bunCnt=0;bunCnt--){
    for(let verbCnt=bunArray[bunCnt].verb_array.length; verbCnt=0; verbCnt--){
      const maenodoushi = bunArray[bunCnt].verb_array[verbCnt]
      if(maenodoushi.hasSubject){
        bunArray[bunNo].verb_array[verbNo].subject=maenodoushi.subject
        return
      }
    }
  }
}

export {searchMaenoBunForShugo}