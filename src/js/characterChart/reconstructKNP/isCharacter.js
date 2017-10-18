const isCharacter = (KNP_character_array, temp_character_name) => {
  for (let charaCnt = 0; charaCnt < KNP_character_array.length; charaCnt++) {
    if (temp_character_name === KNP_character_array[charaCnt].name) {
      return true
    }
  }
  return false
}



export {isCharacter}