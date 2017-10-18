/**
 * Created by uetsujitomoya on 2017/08/17.
 */


import {isCharacter} from './characterChart/reconstructKNP/isCharacter'
// import verbInSentence from "../js/create_verbInSentence_class.js"
import {createsvg} from './characterChart/nodeAndArray/arrow_node.js'
import Sentence from './characterChart/reconstructKNP/defineSentence'

//const firstJapaneseRowIdxInBunsetsu = 2

const reconstructKNP = (raw_2d_array, characterArray, nodeArray) =>
{//係り受けを調べる
  let sentenceNum = 0
  let sentenceArray = []
  let tempSentence2dArray = []
  let tmpRowNo = 0
  console.log(raw_2d_array)
  for(const row of raw_2d_array){
    if (row[0] !== 'EOS') {
      tempSentence2dArray.push(row)
    } else {
      //console.log(sentenceNum)
     sentenceArray.push(
       new Sentence(tmpRowNo, tempSentence2dArray, characterArray, sentenceNum, nodeArray)
     )
      sentenceNum++
      tempSentence2dArray = []
    }
    tmpRowNo++
  }
  return {KNP_sentence_array:sentenceArray,sentenceArray:sentenceArray}
}

const existsSubject = (bunsetsu, characterArray) => {
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  const tmpCharacterName = bunsetsu.csv_raw_array[1][0]
  for (var col_num = 0; col_num < bunsetsuInfoRow.length; col_num++) {
    if (bunsetsuInfoRow[col_num].match('ガ格') && isCharacter(characterArray, tmpCharacterName)) {
      bunsetsu.isSubject = true
      bunsetsu.subject = tmpCharacterName
      break
    }
  }
}

const existsObject = (bunsetsu, characterArray) => {
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  const tmpCharacterName = bunsetsu.csv_raw_array[1][0]
  for (let col_num = 0; col_num < bunsetsuInfoRow.length; col_num++) {
    if ((bunsetsuInfoRow[col_num].match('ヲ格') || bunsetsuInfoRow[col_num].match('ニ格')) && isCharacter(characterArray, tmpCharacterName)) {
      bunsetsu.isObject = true
      bunsetsu.object = tmpCharacterName
      break
    }
  }
}

export {reconstructKNP}