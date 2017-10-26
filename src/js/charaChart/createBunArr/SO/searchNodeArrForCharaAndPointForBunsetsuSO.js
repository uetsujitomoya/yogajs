
const searchNodeArr=(nodeArr, tmpName)=>{

  for(const node of nodeArr){
    if(tmpName===node.name){
      //console.log(node)
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

