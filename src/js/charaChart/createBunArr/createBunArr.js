/**
 * Created by uetsujitomoya on 2017/08/17.
 */


import {isCharacter} from './isChara'
// import BunVerb from "../js/create_verbInSentence_class.js"
import {createsvg} from '../nodeAndArrow/arrowNode.js'
import Bun from './defineBun'

//const firstJapaneseRowIdxInBunsetsu = 2

const createBunArr = (raw2dArr, charaArr, nodeArr) =>
{//係り受けを調べる
  let bunNo = 0
  let bunArr = []
  let tmpBun2dArr = []
  let tmpRowNo = 0
  for(const row of raw2dArr){
    if (row[0] !== 'EOS') {
      tmpBun2dArr.push(row)
    } else {
      //console.log(bunNo)
     bunArr.push(
       new Bun(tmpRowNo, tmpBun2dArr, charaArr, bunNo, nodeArr,bunArr)
     )
      bunNo++
      tmpBun2dArr = []
    }
    tmpRowNo++
  }
  return {KNP_sentence_array:bunArr,sentenceArray:bunArr}
}

const existsSubject = (bunsetsu, charaArr) => {
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  const tmpCharaName = bunsetsu.csv_raw_array[1][0]
  for (var colCnt = 0; colCnt < bunsetsuInfoRow.length; colCnt++) {
    if (bunsetsuInfoRow[colCnt].match('ガ格') && isCharacter(charaArr, tmpCharaName)) {
      bunsetsu.isSubject = true
      bunsetsu.subject = tmpCharaName
      break
    }
  }
}

const existsObject = (bunsetsu, characterArray) => {
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  const tmpCharaName = bunsetsu.csv_raw_array[1][0]
  for (let colCnt = 0; colCnt < bunsetsuInfoRow.length; colCnt++) {
    if ((bunsetsuInfoRow[colCnt].match('ヲ格') || bunsetsuInfoRow[colCnt].match('ニ格')) && isCharacter(characterArray, tmpCharaName)) {
      bunsetsu.isObject = true
      bunsetsu.object = tmpCharaName
      break
    }
  }
}

export {createBunArr}