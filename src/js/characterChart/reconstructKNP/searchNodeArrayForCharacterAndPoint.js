const searchNodeArrayForCharacterAndPoint=(nodeArray,tmpName)=>{
  for(const node of nodeArray){
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

export{searchNodeArrayForCharacterAndPoint}