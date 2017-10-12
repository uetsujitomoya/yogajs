/**
 * Created by uetsujitomoya on 2017/08/17.
 */

import　{includesVerb} from './find_verb.js'
// import verbInSentence from "../js/create_verbInSentence_class.js"
import {createsvg} from './arrow_node.js'
import KNP_Sentence from './characterChart/defineSentenceClass'


const firstJapaneseRowIdxInBunsetsu = 2

let reconstruct_KNP = (raw_2d_array, KNP_character_array,nodeArray) =>
{//係り受けを調べる
  let sentenceNum = 0
  let sentenceArray = []
  let tempSentence2dArray = []
  let temp_rowNo = 0
  console.log(raw_2d_array)
  for(const row_array of raw_2d_array){
    if (row_array[0] !== 'EOS') {
      tempSentence2dArray.push(row_array)
    } else {
      //console.log(sentenceNum)
     sentenceArray.push(
       new KNP_Sentence(temp_rowNo, tempSentence2dArray, KNP_character_array, sentenceNum, nodeArray)
     )
      sentenceNum++
      tempSentence2dArray = []
    }
    temp_rowNo++
  }
  return {KNP_sentence_array:sentenceArray,sentenceArray:sentenceArray}
}

let existsSubject = (bunsetsu, KNP_character_array) => {
  const bunsetsu_info_row = bunsetsu.csv_raw_array[0]
  const temp_character_name = bunsetsu.csv_raw_array[1][0]
  for (var col_num = 0; col_num < bunsetsu_info_row.length; col_num++) {
    if (bunsetsu_info_row[col_num].match('ガ格') && isCharacter(KNP_character_array, temp_character_name)) {
      bunsetsu.isSubject = true
      bunsetsu.subject = temp_character_name
      break
    }
  }
}

let existsObject = (bunsetsu, KNP_character_array) => {
  const bunsetsu_info_row = bunsetsu.csv_raw_array[0]
  const temp_character_name = bunsetsu.csv_raw_array[1][0]
  for (let col_num = 0; col_num < bunsetsu_info_row.length; col_num++) {
    if ((bunsetsu_info_row[col_num].match('ヲ格') || bunsetsu_info_row[col_num].match('ニ格')) && isCharacter(KNP_character_array, temp_character_name)) {
      bunsetsu.isObject = true
      bunsetsu.object = temp_character_name
      break
    }
  }
}

let isCharacter = (KNP_character_array, temp_character_name) => {
  for (let chara_num = 0; chara_num < KNP_character_array.length; chara_num++) {
    if (temp_character_name === KNP_character_array[chara_num].name) {
      return true
    }
  }
  return false
}

class verbInSentence {
  constructor (bunsetsuNum_inSentence, bunsetsuRawArray, sentenceNum) {
    this.bunsetsuNum_inSentence = bunsetsuNum_inSentence
    this.sentenceNum = sentenceNum
    this.surface_form = bunsetsuRawArray[2][0]
    this.subject = null
    this.object = null
  }
  rewriteSubject (character) {
    this.subject = character
  }
}

export {reconstruct_KNP}