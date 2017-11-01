const applySliderForNodeText=(sliderBunArr,nodeArr)=>{
  for(let node of nodeArr){
    node.bunArr=[]
    for(const bun of sliderBunArr){
      if(bun.charaNameArr.indexOf(node.name) >= 0){
        console.log(bun.surfaceForm)
        node.bunArr.push(
          {
            bunNo: bun.bunNo,
            surfaceForm: bun.surfaceForm
          }
        )
      }
    }
  }
}

export {applySliderForNodeText}