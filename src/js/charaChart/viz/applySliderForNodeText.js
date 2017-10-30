const applySliderForNodeText=(sliderBunArr,nodeArr)=>{
  for(let node of nodeArr){
    node.bunArr=[]
    for(const bun of sliderBunArr){
      if(bun.charaNameArr.indexOf(node.name) >= 0){
        node.bunArr.push(
          {
            idx: bun.idx,
            surfaceForm: bun.surfaceForm
          }
        )
      }
    }
  }
}

export {applySliderForNodeText}