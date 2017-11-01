
const searchNodeArr=(nodeArr, tmpName,bun)=>{

  for(const node of nodeArr){
    if(tmpName===node.name){
      //console.log(node)
      bun.charaNameArr.push(node.name)
      node.bunArr.push(
        {
          bunNo: bun.bunNo,
          surfaceForm: bun.surfaceForm
        }
      )
      return{
        name:node.name,
        isCharacter:true,
        x:node.x,
        y:node.y,
        nodeIdx:node.nodeIdx
      }
    }
  }
  return{isCharacter:false}
}


export{searchNodeArr}

