const isCharacter = (nodeArr, tmpcharaName) => {
  for (let charaCnt = 0; charaCnt < nodeArr.length; charaCnt++) {
    if (tmpcharaName === nodeArr[charaCnt].name) {
      return true
    }
  }
  return false
}

export {isCharacter}