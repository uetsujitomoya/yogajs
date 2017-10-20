import Bunsetsu from './defineBunsetsu.js'
import BunKihonku from './defineKihonku.js'
import {rodata} from '../../rodata'
import BunVerb from './defineBunVerb'
import {searchMaenoBunForShugo} from './SO/searchMaenoBunForS'

const startingBunsetsuRowIdxInSentence = 1
const startingKihonkuRowIdxInSentence = 2
const firstJapaneseRowIdxInSentence = 3

const bunsetsuSymbol = rodata.bunsetsuSymbol
const kihonkuSymbol = rodata.kihonkuSymbol

export default class Bun {
  constructor (rawRowIdx, bun2dArrayFromKNP, charaArray, sentenceIdx, nodeArray) {

    if (bun2dArrayFromKNP.length === 1) {
      return null
    }

    this.nodeArray=[]//forTextView

    this.verb_array = []

    // this.csv_raw_array=[]
    this.rowNo = rawRowIdx
    this.bunsetsuArray = []
    //console.log(bun2dArrayFromKNP)

    this.bunsetsuArray.length = countBunsetsu(bun2dArrayFromKNP)

    this.kihonkuArray = []
    this.kihonkuArray.length = countKihonku(bun2dArrayFromKNP)

    let bunsetsuKNParray = []
    let kihonkuKNParray = []

    bunsetsuKNParray.push(bun2dArrayFromKNP[startingBunsetsuRowIdxInSentence])// 0文節目　開始宣言をプッシュ

    bunsetsuKNParray.push(bun2dArrayFromKNP[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ
    kihonkuKNParray.push(bun2dArrayFromKNP[startingKihonkuRowIdxInSentence])// 0基本句目　開始宣言をプッシュ

    let bunBunsetsuIdx = 0
    let bunKihonkuIdx = 0

    for (let tmpRowNo = firstJapaneseRowIdxInSentence; tmpRowNo < bun2dArrayFromKNP.length; tmpRowNo++) {

      let tmpSurfaceForm = bun2dArrayFromKNP[tmpRowNo][0]

      if (tmpSurfaceForm === kihonkuSymbol && bun2dArrayFromKNP[tmpRowNo - 1][0] !== bunsetsuSymbol) {

        this.kihonkuArray[bunKihonkuIdx] = new BunKihonku(bunKihonkuIdx, kihonkuKNParray)// 文の中の通し番号での基本句array
        kihonkuKNParray = []
        bunKihonkuIdx++

      } else if (tmpSurfaceForm === bunsetsuSymbol) {

        this.kihonkuArray[bunKihonkuIdx] = new BunKihonku(bunKihonkuIdx, kihonkuKNParray)// 文の中の通し番号での基本句array
        kihonkuKNParray = []
        bunKihonkuIdx++
        this.bunsetsuArray[bunBunsetsuIdx] = new Bunsetsu(bunBunsetsuIdx, bunsetsuKNParray, charaArray,this)// 文の中の通し番号での文節array

        // verb_array作成
        if (this.bunsetsuArray[bunBunsetsuIdx].isVerb) { this.verb_array.push(new BunVerb(bunBunsetsuIdx, bunsetsuKNParray, sentenceIdx)) }
        bunsetsuKNParray = []
        bunBunsetsuIdx++

      }

      bunsetsuKNParray.push(bun2dArrayFromKNP[tmpRowNo])
      kihonkuKNParray.push(bun2dArrayFromKNP[tmpRowNo])
    }

    this.bunsetsuArray[bunBunsetsuIdx] = new Bunsetsu(bunBunsetsuIdx, bunsetsuKNParray, charaArray,this)

    // verb_array作成

    if (this.bunsetsuArray[bunBunsetsuIdx].isVerb) {
      this.verb_array.push(new BunVerb(bunBunsetsuIdx, bunsetsuKNParray, sentenceIdx))
    }
    this.kihonkuArray[bunKihonkuIdx] = new BunKihonku(bunKihonkuIdx, kihonkuKNParray)
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
    for(const kakaruBunsetsu of this.bunsetsuArray){
      for (let kakarareruBunsetsuCnt = 0; kakarareruBunsetsuCnt < this.bunsetsuArray.length; kakarareruBunsetsuCnt++) {
        if (kakaruBunsetsu.kakaru_bunsetsu_id === this.bunsetsuArray[kakarareruBunsetsuCnt].id) {
          this.bunsetsuArray[kakarareruBunsetsuCnt].kakarareru_bunsetsu_id_array.push(kakaruBunsetsu.id)
          break
        }
      }
    }
  }

  inputEachKakarareruKihonkuID () {
    for(const kakaruKihonku of this.kihonkuArray){
      for (let kakarareruKihonkuCnt = 0; kakarareruKihonkuCnt < this.kihonkuArray.length; kakarareruKihonkuCnt++) {
        if (kakaruKihonku.kakatu_kihonku_id === this.kihonkuArray[kakarareruKihonkuCnt].id) {
          this.kihonkuArray[kakarareruKihonkuCnt].kakarareru_kihonku_id_array.push(kakaruKihonku.id)
          break
        }
      }
    }
  }

  findSubjectOfVerb (verbBunsetsuNo, tempVerbNum) {
    for (let clauseCnt = verbBunsetsuNo; clauseCnt >= 0; clauseCnt--) {
      let tmpClause = this.bunsetsuArray[clauseCnt]
      if (tmpClause.isSubject) {
        this.bunsetsuArray[ verbBunsetsuNo ].subject_of_verb = tmpClause.subject
        this.verb_array[tempVerbNum].rewriteSubject(tmpClause.subject)
        break
      }else{
        //searchMaenoBunForShugo(tmpClause,previousSentences)
      }
    }
  }

  findObjectOfVerb (verbBunsetsuNo, tmpVerbNo) {
    for (let bunsetsuCnt = verbBunsetsuNo; bunsetsuCnt >= 0; bunsetsuCnt--) {
      let tmpBunsetsu = this.bunsetsuArray[bunsetsuCnt]
      if (tmpBunsetsu.isObject) {
        this.bunsetsuArray[ verbBunsetsuNo ].object_of_verb = tmpBunsetsu.object
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

const countBunsetsu = (knp) => {
  let cnt = 0
  for(const row of knp){
    if(typeof row!=='undefined'){
      if (row[0] === bunsetsuSymbol) {
        cnt++
      }
    }
  }
  return cnt
}

const countKihonku = (knp) => {
  let cnt = 0
  for(const row of knp){
    if(typeof row!=='undefined') {
      if (row[0] === kihonkuSymbol) {
        cnt++
      }
    }
  }
  return cnt
}