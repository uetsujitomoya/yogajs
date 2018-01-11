
const searchMaenoBunForShugo = (bunArr, bunNo, verbNo,bun,nodeArr)=>{
  //console.log("verbNo=%d",verbNo)


  //まずその分から探す
  for(let verbCnt = verbNo - 1 ; verbCnt >= 0 ; verbCnt-- ){
    const maenodoushi = bun.verbArr[verbCnt]
    if(maenodoushi.hasSubject){

      bun.verbArr[verbNo].rewriteSubjectAndAddBun2Node(nodeArr[maenodoushi.subject.nodeIdx], bun)

      return
    }
  }

  //次にそれより前の文から探す
  for(let bunCnt = bunNo - 1 ; bunCnt >= 0 ; bunCnt-- ){
    if(Object.keys(bunArr[bunCnt]).length!==0 && bunArr[bunCnt].verbArr!==void 0){
      for(let verbCnt=bunArr[bunCnt].verbArr.length - 1; verbCnt >= 0 ; verbCnt--){
        const maenodoushi = bunArr[bunCnt].verbArr[verbCnt]
        if(maenodoushi.hasSubject){
          bun.verbArr[verbNo].rewriteSubjectAndAddBun2Node(nodeArr[maenodoushi.subject.nodeIdx], bun)
          return
        }
      }
    }
  }
}

export {searchMaenoBunForShugo}