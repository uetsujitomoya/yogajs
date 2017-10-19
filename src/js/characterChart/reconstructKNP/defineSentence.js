import Bunsetsu from './defineBunsetsu.js'
import KihonkuInSentence from './defineKihonku.js'
import {rodata} from '../../rodata'
import verbInSentence from './defineVerbInSentence'
import {searchPreviousSentencesForSubject} from './SubjectOrObject/searchPreviousSentencesForSubject'

const startingBunsetsuRowIdxInSentence = 1
const startingKihonkuRowIdxInSentence = 2
const firstJapaneseRowIdxInSentence = 3

const bunsetsuSymbol = rodata.bunsetsuSymbol
const kihonkuSymbol = rodata.kihonkuSymbol

export default class Sentence {
  constructor (rawRowIdx, bun2dArrayFromKNP, charaArray, sentenceIdx, nodeArray) {

    if (bun2dArrayFromKNP.length === 1) {
      return 0
    }

    this.verb_array = []

    // this.csv_raw_array=[]
    this.rowNo = rawRowIdx
    this.bunsetsu_array = []
    //console.log(bun2dArrayFromKNP)

    this.bunsetsu_array.length = count_bunsetsu(bun2dArrayFromKNP)

    this.kihonkuArray = []
    this.kihonkuArray.length = count_kihonku(bun2dArrayFromKNP)

    let temp2dArrayForBunsetsu = []
    let temp2dArrayForKihonku = []

    temp2dArrayForBunsetsu.push(bun2dArrayFromKNP[startingBunsetsuRowIdxInSentence])// 0文節目　開始宣言をプッシュ

    temp2dArrayForBunsetsu.push(bun2dArrayFromKNP[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ
    temp2dArrayForKihonku.push(bun2dArrayFromKNP[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ

    let bunsetsuIdxInSentence = 0
    let kihonkuIdxInSentence = 0

    for (let temp_rowNo = firstJapaneseRowIdxInSentence; temp_rowNo < bun2dArrayFromKNP.length; temp_rowNo++) {

      let temp_surface_form = bun2dArrayFromKNP[temp_rowNo][0]

      if (temp_surface_form === kihonkuSymbol && bun2dArrayFromKNP[temp_rowNo - 1][0] !== bunsetsuSymbol) {

        this.kihonkuArray[kihonkuIdxInSentence] = new KihonkuInSentence(kihonkuIdxInSentence, temp2dArrayForKihonku)// 文の中の通し番号での基本句array
        temp2dArrayForKihonku = []
        kihonkuIdxInSentence++

      } else if (temp_surface_form === bunsetsuSymbol) {

        this.kihonkuArray[kihonkuIdxInSentence] = new KihonkuInSentence(kihonkuIdxInSentence, temp2dArrayForKihonku)// 文の中の通し番号での基本句array
        temp2dArrayForKihonku = []
        kihonkuIdxInSentence++
        this.bunsetsu_array[bunsetsuIdxInSentence] = new Bunsetsu(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, charaArray)// 文の中の通し番号での文節array

        // verb_array作成
        if (this.bunsetsu_array[bunsetsuIdxInSentence].isVerb) { this.verb_array.push(new verbInSentence(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, sentenceIdx)) }
        temp2dArrayForBunsetsu = []
        bunsetsuIdxInSentence++

      }

      temp2dArrayForBunsetsu.push(bun2dArrayFromKNP[temp_rowNo])
      temp2dArrayForKihonku.push(bun2dArrayFromKNP[temp_rowNo])
    }

    this.bunsetsu_array[bunsetsuIdxInSentence] = new Bunsetsu(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, charaArray)

    // verb_array作成

    if (this.bunsetsu_array[bunsetsuIdxInSentence].isVerb) {
      this.verb_array.push(new verbInSentence(bunsetsuIdxInSentence, temp2dArrayForBunsetsu, sentenceIdx))
    }
    this.kihonkuArray[kihonkuIdxInSentence] = new KihonkuInSentence(kihonkuIdxInSentence, temp2dArrayForKihonku)
    this.inputEachKakarareruBunsetsuID()
    this.inputEachKakarareruKihonkuID()

    //objectかsubjectを探す。人間でなくてもいい
    for (let tempVerbNum = 0; tempVerbNum < this.verb_array.length; tempVerbNum++) {
      this.findObjectOfVerb(this.verb_array[tempVerbNum].bunsetsuNum_inSentence, tempVerbNum)
      this.findSubjectOfVerb(this.verb_array[tempVerbNum].bunsetsuNum_inSentence, tempVerbNum)
    }

    this.surfaceForm = ""
    // this.basic_form = row_array[2]
    this.storeSurfaceForm(bun2dArrayFromKNP)
  }

  inputEachKakarareruBunsetsuID () {
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

  inputEachKakarareruKihonkuID () {
    for(const kakaru_kihonku of this.kihonkuArray){
      for (let kakarareru_kihonku_num = 0; kakarareru_kihonku_num < this.kihonkuArray.length; kakarareru_kihonku_num++) {
        if (kakaru_kihonku.kakatu_kihonku_id === this.kihonkuArray[kakarareru_kihonku_num].id) {
          this.kihonkuArray[kakarareru_kihonku_num].kakarareru_kihonku_id_array.push(kakaru_kihonku.id)
          break
        }
      }
    }
  }

  findSubjectOfVerb (verbBunsetsuNo, tempVerbNum) {
    for (let temp_clause_num = verbBunsetsuNo; temp_clause_num >= 0; temp_clause_num--) {
      let temp_clause = this.bunsetsu_array[temp_clause_num]
      if (temp_clause.isSubject) {
        this.bunsetsu_array[ verbBunsetsuNo ].subject_of_verb = temp_clause.subject
        this.verb_array[tempVerbNum].rewriteSubject(temp_clause.subject)
        break
      }else{
        //searchPreviousSentencesForSubject(temp_clause,previousSentences)
      }
    }
  }

  findObjectOfVerb (verbBunsetsuNo, tmpVerbNo) {
    for (let bunsetsuCnt = verbBunsetsuNo; bunsetsuCnt >= 0; bunsetsuCnt--) {
      let tmpBunsetsu = this.bunsetsu_array[bunsetsuCnt]
      if (tmpBunsetsu.isObject) {
        this.bunsetsu_array[ verbBunsetsuNo ].object_of_verb = tmpBunsetsu.object
        this.verb_array[tmpVerbNo].object = tmpBunsetsu.object
        this.verb_array[tmpVerbNo].rewriteObject(tmpBunsetsu.object)
        break
      }
    }
  }

  storeSurfaceForm(bunFromKNP){
    //やっぱり基本句から取っていく
    for(const kihonku of this.kihonkuArray){
      //console.log(kihonku)
      this.surfaceForm += kihonku.surfaceForm
    }
    console.log(this.surfaceForm)
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