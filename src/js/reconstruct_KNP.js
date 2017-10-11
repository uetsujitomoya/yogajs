/**
 * Created by uetsujitomoya on 2017/08/17.
 */

import　{includesVerb} from './find_verb.js'
// import verbInSentence from "../js/create_verbInSentence_class.js"
import {createsvg} from './arrow_node.js'

const firstJapaneseRowIdxInSentence = 3
const firstJapaneseRowIdxInBunsetsu = 2
const startingKihonkuRowIdxInSentence = 2
const startingBunsetsuRowIdxInSentence = 1

let reconstruct_KNP = (raw_2d_array, KNP_character_array,nodeArray) =>
{//係り受けを調べる
  let sentenceNum = 0
  let sentenceArray = []
  let tempSentence2dArray = []
  let temp_rowNo = 0
  raw_2d_array.forEach((row_array) => {
    if (row_array[0] !== 'EOS') {
      tempSentence2dArray.push(row_array)
    } else {
      //console.log(sentenceNum)
      sentenceArray.push(new KNP_Sentence(temp_rowNo, tempSentence2dArray, KNP_character_array, sentenceNum, nodeArray))
      sentenceNum++
      tempSentence2dArray = []
    }
    temp_rowNo++
  })
  return {KNP_sentence_array:sentenceArray,sentenceArray:sentenceArray}
}

let count_bunsetsu = (input_2d_array) => {
  let cnt = 0
  input_2d_array.forEach((row_array) => {
    if (row_array[0] === '*') {
      cnt++
    }
  })
  return cnt
}

let count_kihonku = (input_2d_array) => {
  let cnt = 0
  input_2d_array.forEach((row_array) => {
    if (row_array[0] === '+') {
      cnt++
    }
  })
  return cnt
}

class KNP_Sentence {
  constructor (rawRowIdx, sentence2dArray, characterArray, sentenceIdx, nodeArray) {

    if (sentence2dArray.length === 1) {
      return 0
    }

    this.verb_array = []

    // this.csv_raw_array=[]
    this.rowNo = rawRowIdx
    this.bunsetsu_array = []
    this.bunsetsu_array.length = count_bunsetsu(sentence2dArray)

    this.kihonku_array = []
    this.kihonku_array.length = count_kihonku(sentence2dArray)

    this.surface_form = 'null'
    // this.basic_form = row_array[2]

    let temp_2d_array_for_bunsetsu = []
    let temp_2d_array_for_kihonku = []

    temp_2d_array_for_bunsetsu.push(sentence2dArray[startingBunsetsuRowIdxInSentence])// 0文節目　開始宣言をプッシュ

    temp_2d_array_for_bunsetsu.push(sentence2dArray[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ
    temp_2d_array_for_kihonku.push(sentence2dArray[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ

    let bunsetsu_num_in_sentence = 0
    let kihonku_num_in_sentence = 0

    for (let temp_rowNo = firstJapaneseRowIdxInSentence; temp_rowNo < sentence2dArray.length; temp_rowNo++) {

      let temp_surface_form = sentence2dArray[temp_rowNo][0]

      if (temp_surface_form === '+' && sentence2dArray[temp_rowNo - 1][0] !== '*') {

        this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence, temp_2d_array_for_kihonku)// 文の中の通し番号での基本句array
        temp_2d_array_for_kihonku = []
        kihonku_num_in_sentence++

      } else if (temp_surface_form === '*') {

        this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence, temp_2d_array_for_kihonku)// 文の中の通し番号での基本句array
        temp_2d_array_for_kihonku = []
        kihonku_num_in_sentence++
        this.bunsetsu_array[bunsetsu_num_in_sentence] = new KNP_Bunsetsu(bunsetsu_num_in_sentence, temp_2d_array_for_bunsetsu, characterArray)// 文の中の通し番号での文節array

        // verb_array作成
        if (this.bunsetsu_array[bunsetsu_num_in_sentence].isVerb) { this.verb_array.push(new verbInSentence(bunsetsu_num_in_sentence, temp_2d_array_for_bunsetsu, sentenceIdx)) }
        temp_2d_array_for_bunsetsu = []
        bunsetsu_num_in_sentence++

      }

      temp_2d_array_for_bunsetsu.push(sentence2dArray[temp_rowNo])
      temp_2d_array_for_kihonku.push(sentence2dArray[temp_rowNo])

    }

    this.bunsetsu_array[bunsetsu_num_in_sentence] = new KNP_Bunsetsu(bunsetsu_num_in_sentence, temp_2d_array_for_bunsetsu, characterArray)

    // verb_array作成
    if (this.bunsetsu_array[bunsetsu_num_in_sentence].isVerb) {
      this.verb_array.push(new verbInSentence(bunsetsu_num_in_sentence, temp_2d_array_for_bunsetsu, sentenceIdx))
    }
    this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence, temp_2d_array_for_kihonku)
    this.input_each_kakarareru_bunsetsu_id()
    this.input_each_kakarareru_kihonku_id()
    for (let tempVerbNum = 0; tempVerbNum < this.verb_array.length; tempVerbNum++) {
      this.search_object_of_verb(this.verb_array[tempVerbNum].bunsetsuNum_inSentence, tempVerbNum)
      this.search_subject_of_verb(this.verb_array[tempVerbNum].bunsetsuNum_inSentence, tempVerbNum)
    }
  }

  input_each_kakarareru_bunsetsu_id () {
    // 動詞なら、その動詞にかかるのを探していく
    this.bunsetsu_array.forEach((kakaru_bunsetsu) => {
      for (let kakarareru_bunsetsu_num = 0; kakarareru_bunsetsu_num < this.bunsetsu_array.length; kakarareru_bunsetsu_num++) {
        if (kakaru_bunsetsu.kakaru_bunsetsu_id === this.bunsetsu_array[kakarareru_bunsetsu_num].id) {
          this.bunsetsu_array[kakarareru_bunsetsu_num].kakarareru_bunsetsu_id_array.push(kakaru_bunsetsu.id)
          break
        }
      }
    })
  }

  input_each_kakarareru_kihonku_id () {
    this.kihonku_array.forEach((kakaru_kihonku) => {
      for (let kakarareru_kihonku_num = 0; kakarareru_kihonku_num < this.kihonku_array.length; kakarareru_kihonku_num++) {
        if (kakaru_kihonku.kakatu_kihonku_id === this.kihonku_array[kakarareru_kihonku_num].id) {
          this.kihonku_array[kakarareru_kihonku_num].kakarareru_kihonku_id_array.push(kakaru_kihonku.id)
          break
        }
      }
    })
  }

  search_subject_of_verb (verb_clause_num, tempVerbNum) {
    for (let temp_clause_num = verb_clause_num; temp_clause_num >= 0; temp_clause_num--) {
      let temp_clause = this.bunsetsu_array[temp_clause_num]
      if (temp_clause.isSubject) {
        this.bunsetsu_array[ verb_clause_num ].subject_of_verb = temp_clause.subject
        this.verb_array[tempVerbNum].rewriteSubject(temp_clause.subject)
        break
      }
    }
  }

  search_object_of_verb (verb_clause_num, tempVerbNum) {
    for (let temp_clause_num = verb_clause_num; temp_clause_num >= 0; temp_clause_num--) {
      let temp_clause = this.bunsetsu_array[temp_clause_num]
      if (temp_clause.isObject) {
        this.bunsetsu_array[ verb_clause_num ].object_of_verb = temp_clause.object
        this.verb_array[tempVerbNum].object = temp_clause.object
        break
      }
    }
  }
}

class KNP_Bunsetsu {
  constructor (num, input_2d_array, KNP_character_array) {
    this.csv_raw_array = input_2d_array
    this.id = num + 'D'

    this.kihonku_array = []
    this.kihonku_array.length = count_kihonku(input_2d_array)

    this.word_array = []

    this.kakaru_bunsetsu_id = input_2d_array[0][1]
    this.kakarareru_bunsetsu_id_array = []
    this.surface_form = ''
    input_2d_array.forEach((row_array) => {
      this.surface_form += row_array[0]
      this.word_array.push(new KNP_word(row_array))
    })
    this.isVerb = false

    this.make_kihonku_array_in_bunsetsu(input_2d_array)


    const temp_character_name = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]

    if (isCharacter(KNP_character_array, temp_character_name)) {

      this.addAboutSubjectOrObject(this.csv_raw_array[0],temp_character_name)

    } else if(this.csv_raw_array.length>firstJapaneseRowIdxInBunsetsu+1){/*AさんBさんにも対応*/
      const tempCharacterNameWithHonorific = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]+this.csv_raw_array[firstJapaneseRowIdxInBunsetsu+1][0]
      if (isCharacter(KNP_character_array, tempCharacterNameWithHonorific)) {
        console.log(tempCharacterNameWithHonorific)
        this.addAboutSubjectOrObject(this.csv_raw_array[0],tempCharacterNameWithHonorific)
      }else{
        this.find_verb_in_bunsetsu()
      }
    }else{
      this.find_verb_in_bunsetsu()
    }
  }

  addAboutSubjectOrObject(bunsetsu_info_row,characterName){
    for (let col_num = 0; col_num < bunsetsu_info_row.length; col_num++) {
      if ((bunsetsu_info_row[col_num].match('ヲ格') || bunsetsu_info_row[col_num].match('ニ格'))) {
        this.add_about_object(characterName)
        break
      } else if (bunsetsu_info_row[col_num].match('ガ格')) {
        this.add_about_subject(characterName)
        break
      }
    }
  }

  make_kihonku_array_in_bunsetsu (bunsetsu_raw_2d_array) {
    let kihonku_num_in_bunsetsu = 0
    let temp_2d_array_for_kihonku = []
    if (bunsetsu_raw_2d_array.length >= 1) {
      let japanese_starting_num = 2
      for (let temp_rowNo = japanese_starting_num; temp_rowNo < bunsetsu_raw_2d_array.length; temp_rowNo++) {
        let temp_row = bunsetsu_raw_2d_array[temp_rowNo]
        if (temp_row[0] === '+') { // 文節内 2こ目以降の基本句
          this.kihonku_array[kihonku_num_in_bunsetsu] = new KNP_kihonku_in_bunsetsu(temp_2d_array_for_kihonku)// 文の中の通し番号での基本句array
          temp_2d_array_for_kihonku = []
          kihonku_num_in_bunsetsu++
        }
        temp_2d_array_for_kihonku.push(temp_row)
      }
      this.kihonku_array[kihonku_num_in_bunsetsu] = new KNP_kihonku_in_bunsetsu(temp_2d_array_for_kihonku)// 文の中の通し番号での基本句array
    }
  }

  add_about_object (characterName) {
    this.isObject = true
    this.object = characterName
  }

  add_about_subject (characterName) {
    this.isSubject = true
    this.subject = characterName
  }

  find_verb_in_bunsetsu () {
    if (includesVerb(this.word_array[firstJapaneseRowIdxInBunsetsu].raw_array)) {
      this.isVerb = true
      this.verb = this.word_array[firstJapaneseRowIdxInBunsetsu].basic_form
    }
  }
}

class KNP_kihonku_in_sentence {
  constructor (num, input_2d_array) {
    this.csv_raw_array = input_2d_array
    this.id = num + 'D'

    this.word_array = []
    for (let rowNo = 1; rowNo < input_2d_array.length; rowNo++) {
      this.word_array.push(new KNP_word(input_2d_array[rowNo]))
    }

    this.kakaru_kihonku_id = input_2d_array[0][1]
    this.kakarareru_kihonku_id_array = []
    this.surface_form = ''
    input_2d_array.forEach((row_array) => {
      this.surface_form += row_array[0]
    })
  }
}

class KNP_kihonku_in_bunsetsu {
  constructor (row_array) {
    this.csv_raw_array = []
    this.word_array = []
    for (let rowNo = 1; rowNo < row_array.length; rowNo++) {
    }
    this.subject = 'null'
    this.object = 'null'
    this.kakaruNo = 'null'
    this.surface_form = row_array[0]
  }
}

class KNP_word {
  constructor (row_array) {
    this.raw_array = row_array
    this.csv_raw_array = []
    this.hinshi = row_array[3]
  }
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