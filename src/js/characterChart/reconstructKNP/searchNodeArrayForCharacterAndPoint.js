const searchNodeArrayForCharacterAndPoint=(nodeArray,tmpName)=>{
  for(const node of nodeArray){
    if(tmpName===node.name){
      return{
        name:node.name,
        isCharacter:true,
        x:node.x,
        y:node.y,
        nodeIdx:node.idx
      }
    }
  }
  return{isCharacter:false}
}

export{searchNodeArrayForCharacterAndPoint}