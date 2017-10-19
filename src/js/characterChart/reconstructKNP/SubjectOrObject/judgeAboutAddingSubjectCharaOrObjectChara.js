import {searchNodeArrayForCharacterAndPoint} from '../searchNodeArrayForCharacterAndPoint'
import {rodata} from '../../../rodata'

const firstJapaneseRowIdxInBunsetsu=rodata.firstJapaneseRowIdxInBunsetsu

const judgeAboutAddingSubjectCharaOrObjectChara=(charaArray, tmpName,bunsetsu)=> {
  let result = searchNodeArrayForCharacterAndPoint(charaArray, tmpName)
  //console.log(result)
  if (result.isCharacter) {
    bunsetsu.addAboutSubjectOrObject(bunsetsu.csv_raw_array[0], tmpName,result)
  } else if (bunsetsu.csv_raw_array.length > firstJapaneseRowIdxInBunsetsu + 1) {/*AさんBさんにも対応*/
    const tempCharaNameWithHonorific = bunsetsu.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0] + bunsetsu.csv_raw_array[firstJapaneseRowIdxInBunsetsu + 1][0]
    result = searchNodeArrayForCharacterAndPoint(charaArray, tempCharaNameWithHonorific)
    //console.log(result)
    if (result.isCharacter) {
      //console.log(tempCharaNameWithHonorific)
      bunsetsu.addAboutSubjectOrObject(bunsetsu.csv_raw_array[0], tempCharaNameWithHonorific,result)
    } else {
      bunsetsu.findVerbInBunsetsu()
    }
  } else {
    bunsetsu.findVerbInBunsetsu()
  }
}

export {judgeAboutAddingSubjectCharaOrObjectChara}

