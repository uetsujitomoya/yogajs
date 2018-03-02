const applySliderForNodeText=(sliderBunArr,nodeArr)=>{
  for(let node of nodeArr){
    node.bunArr=[]
    for(const bun of sliderBunArr){
      //console.log(bun.charaNameArr)
      //console.log(node.name)
      if(bun.charaNameArr.indexOf(node.name) >= 0){
        //console.log("push")
        //console.log(bun)
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