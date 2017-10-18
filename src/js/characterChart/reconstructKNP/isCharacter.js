const isCharacter = (KNP_character_array, temp_character_name) => {
  for (let charaCnt = 0; charaCnt < KNP_character_array.length; charaCnt++) {
    if (temp_character_name === KNP_character_array[charaCnt].name) {
      return true
    }
  }
  return false
}

const searchNodeArrayForCharacterAndPoint=(nodeArray,tmpName)=>{
  for(const node of nodeArray){
    if(tmpName===node.name){
      return{
        name:node.name,
        isCharacter:true,
        x:node.pointX,
        y:node.pointY,
        nodeIdx:node.idx
      }
    }
  }
  return{isCharacter:false}
}

export {isCharacter,searchNodeArrayForCharacterAndPoint}