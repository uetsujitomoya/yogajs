import KNP_Bunsetsu from './defineBunsetsuClass.js'
import KNP_kihonku_in_sentence from './defineKihonkuClass.js'
import {rodata} from '../rodata'
import verbInSentence from '../defineClassOfVerbInSentence'

const startingBunsetsuRowIdxInSentence = 1
const startingKihonkuRowIdxInSentence = 2
const firstJapaneseRowIdxInSentence = 3



const bunsetsuSymbol = rodata.bunsetsuSymbol
const kihonkuSymbol = rodata.kihonkuSymbol

export default class KNP_Sentence {
  constructor (rawRowIdx, sentence2dArray, characterArray, sentenceIdx, nodeArray) {

    if (sentence2dArray.length === 1) {
      return 0
    }

    this.verb_array = []

    // this.csv_raw_array=[]
    this.rowNo = rawRowIdx
    this.bunsetsu_array = []
    //console.log(sentence2dArray)

    this.bunsetsu_array.length = count_bunsetsu(sentence2dArray)

    this.kihonku_array = []
    this.kihonku_array.length = count_kihonku(sentence2dArray)

    this.surface_form = 'null'
    // this.basic_form = row_array[2]

    let temp2dArrayForBunsetsu = []
    let temp2dArrayForKihonku = []

    temp2dArrayForBunsetsu.push(sentence2dArray[startingBunsetsuRowIdxInSentence])// 0文節目　開始宣言をプッシュ

    temp2dArrayForBunsetsu.push(sentence2dArray[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ
    temp2dArrayForKihonku.push(sentence2dArray[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ

    let bunsetsuIdxInSentence = 0
    let kihonkuIdxInSentence = 0

    for (let temp_rowNo = firstJapaneseRowIdxInSentence; temp_rowNo < sentence2dArray.length; temp_rowNo++) {

      let temp_surface_form = sentence2dArray[temp_rowNo][0]

      if (temp_surface_form === kihonkuSymbol && sentence2dArray[temp_rowNo - 1][0] !== bunsetsuSymbol) {

        this.kihonku_array[kihonkuIdxInSentence] = new KNP_kihonku_in_sentence(kihonkuIdxInSentence, temp2dArrayForKihonku)// 文の中の通し番号での基本句array
        temp2dArrayForKihonku = []
        kihonkuIdxInSentence++

      } else if (temp_surface_form === bunsetsuSymbol) {

        this.kihonku_array[kihonkuIdxInSentence] = new KNP_kihonku_in_sentence(kihonkuIdxInSentence, temp2dArrayForKihonku)// 文の中の通し番号での基本句array
        temp2dArrayForKihonku = []
        kihonkuIdxInSentence++
        this.bunsetsu_array[bunsetsuIdxInSentence] = new KNP_Bunsetsu(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, characterArray)// 文の中の通し番号での文節array

        // verb_array作成
        if (this.bunsetsu_array[bunsetsuIdxInSentence].isVerb) { this.verb_array.push(new verbInSentence(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, sentenceIdx)) }
        temp2dArrayForBunsetsu = []
        bunsetsuIdxInSentence++

      }

      temp2dArrayForBunsetsu.push(sentence2dArray[temp_rowNo])
      temp2dArrayForKihonku.push(sentence2dArray[temp_rowNo])
    }

    this.bunsetsu_array[bunsetsuIdxInSentence] = new KNP_Bunsetsu(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, characterArray)

    // verb_array作成

    if (this.bunsetsu_array[bunsetsuIdxInSentence].isVerb) {
      this.verb_array.push(new verbInSentence(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, sentenceIdx))
    }
    this.kihonku_array[kihonkuIdxInSentence] = new KNP_kihonku_in_sentence(kihonkuIdxInSentence, temp2dArrayForKihonku)
    this.input_each_kakarareru_bunsetsu_id()
    this.input_each_kakarareru_kihonku_id()


    for (let tempVerbNum = 0; tempVerbNum < this.verb_array.length; tempVerbNum++) {
      this.search_object_of_verb(this.verb_array[tempVerbNum].bunsetsuNum_inSentence, tempVerbNum)
      this.search_subject_of_verb(this.verb_array[tempVerbNum].bunsetsuNum_inSentence, tempVerbNum)
    }
  }

  input_each_kakarareru_bunsetsu_id () {
    // 動詞なら、その動詞にかかるのを探していく
    for(const kakaru_bunsetsu of this.bunsetsu_array){
      for (let kakarareru_bunsetsu_num = 0; kakarareru_bunsetsu_num < this.bunsetsu_array.length; kakarareru_bunsetsu_num++) {
        if (kakaru_bunsetsu.kakaru_bunsetsu_id === this.bunsetsu_array[kakarareru_bunsetsu_num].id) {
          this.bunsetsu_array[kakarareru_bunsetsu_num].kakarareru_bunsetsu_id_array.push(kakaru_bunsetsu.id)
          break
        }
      }
    }
  }

  input_each_kakarareru_kihonku_id () {
    for(const kakaru_kihonku of this.kihonku_array){
      for (let kakarareru_kihonku_num = 0; kakarareru_kihonku_num < this.kihonku_array.length; kakarareru_kihonku_num++) {
        if (kakaru_kihonku.kakatu_kihonku_id === this.kihonku_array[kakarareru_kihonku_num].id) {
          this.kihonku_array[kakarareru_kihonku_num].kakarareru_kihonku_id_array.push(kakaru_kihonku.id)
          break
        }
      }
    }
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

let count_bunsetsu = (input_2d_array) => {
  let cnt = 0
  for(const row_array of input_2d_array){
    if(typeof row_array!=='undefined'){
      if (row_array[0] === bunsetsuSymbol) {
        cnt++
      }
    }
  }
  return cnt
}

let count_kihonku = (input_2d_array) => {
  let cnt = 0
  for(const row_array of input_2d_array){
    if(typeof row_array!=='undefined') {
      if (row_array[0] === kihonkuSymbol) {
        cnt++
      }
    }
  }
  return cnt
}