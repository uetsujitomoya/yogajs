const isCharacter = (KNP_character_array, temp_character_name) => {
  for (let chara_num = 0; chara_num < KNP_character_array.length; chara_num++) {
    if (temp_character_name === KNP_character_array[chara_num].name) {
      return true
    }
  }
  return false
}

const searchNodeArrayForCharacterAndPoint=(nodeArray,tmpName)=>{
  for(const node of nodeArray){
    if(tmpName===node.name){
      return{
        isCharacter:true,
        x:node.pointX,
        y:node.pointY
      }
    }
  }
  return{isCharacter:false}
}

export {isCharacter,searchNodeArrayForCharacterAndPoint}