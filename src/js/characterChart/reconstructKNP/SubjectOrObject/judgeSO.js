import {searchNodeArrayForCharacterAndPoint} from '../searchNodeArrayForCharacterAndPoint'
import {rodata} from '../../../rodata'

const firstJapaneseRowIdxInBunsetsu=rodata.firstJapaneseRowIdxInBunsetsu

const judgeSO=(charaArray, tmpName, bunsetsu)=> {
  let resultNode = searchNodeArrayForCharacterAndPoint(charaArray, tmpName)
  //console.log(resultNode)
  if (resultNode.isCharacter) {
    addAboutSubjectOrObject(tmpName,resultNode,bunsetsu)
  } else if (bunsetsu.csv_raw_array.length > firstJapaneseRowIdxInBunsetsu + 1) {/*AさんBさんにも対応*/
    const tempCharaNameWithHonorific = bunsetsu.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0] + bunsetsu.csv_raw_array[firstJapaneseRowIdxInBunsetsu + 1][0]
    resultNode = searchNodeArrayForCharacterAndPoint(charaArray, tempCharaNameWithHonorific)
    //console.log(resultNode)
    if (resultNode.isCharacter) {
      //console.log(tempCharaNameWithHonorific)
      addAboutSubjectOrObject(tempCharaNameWithHonorific,resultNode,bunsetsu)
    } else {
      bunsetsu.findVerbInBunsetsu()
    }
  } else {
    bunsetsu.findVerbInBunsetsu()
  }
}

const addAboutSubjectOrObject=(charaName,node,bunsetsu)=>{
  //文節に主語目的語情報を増やす
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  for (let colIdx = 0; colIdx < bunsetsuInfoRow.length; colIdx++) {
    if ((bunsetsuInfoRow[colIdx].match('ヲ格') || bunsetsuInfoRow[colIdx].match('ニ格'))) {
      addAboutObject(charaName,node,bunsetsu)
      break
    } else if (bunsetsuInfoRow[colIdx].match('ガ格')) {
      addAboutSubject(charaName,node,bunsetsu)
      break
    }
  }
}

const addAboutObject= (charaName,node,bunsetsu)=> {
  bunsetsu.isObject = true
  bunsetsu.object = node
}

const addAboutSubject= (charaName,node,bunsetsu)=> {
  bunsetsu.isSubject = true
  bunsetsu.subject = node
}

export {judgeSO}

