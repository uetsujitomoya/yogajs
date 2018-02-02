import Bunsetsu from './defineBunsetsu.js'
import BunKihonku from './defineKihonku.js'
import {setting} from '../setting'
import BunVerb from './defineBunVerb'
import {searchMaenoBunForShugo} from './SO/searchMaenoBunForS'

const bun1stBunsetsuRId = 1
const bun1stKihonkuRId = 2
const bun1stJapaneseRId = 3

const bunsetsuSymbol = setting.bunsetsuSymbol
const kihonkuSymbol = setting.kihonkuSymbol

export default class Bun {
  constructor (rawRId, bun2dArrFromKNP, nodeArr, bunNo, bunArr) {

    this.charaNameArr=[]

    this.bunNo=bunNo

    let verbNo

    if (bun2dArrFromKNP.length === 1) {
      return null
    }

    //this.nodeArray=[]//forTextView

    this.verbArr = []
    this.rowNo = rawRId
    this.bunsetsuArray = []

    this.bunsetsuArray.length = countBunsetsu(bun2dArrFromKNP)

    this.kihonkuArr = []
    this.kihonkuArr.length = countKihonku(bun2dArrFromKNP)

    let bunsetsuKNParr = []
    let kihonkuKNParr = []

    bunsetsuKNParr.push(bun2dArrFromKNP[bun1stBunsetsuRId])// 0文節目　開始宣言をプッシュ

    bunsetsuKNParr.push(bun2dArrFromKNP[bun1stKihonkuRId])// 0基本句目　開始宣言をプッシュ
    kihonkuKNParr.push(bun2dArrFromKNP[bun1stKihonkuRId])// 0基本句目　開始宣言をプッシュ

    let bunBunsetsuNo = 0
    let bunKihonkuNo = 0

    for (let tmpRowNo = bun1stJapaneseRId; tmpRowNo < bun2dArrFromKNP.length; tmpRowNo++) {

      let tmpSurfaceForm = bun2dArrFromKNP[tmpRowNo][0]

      if (tmpSurfaceForm === kihonkuSymbol && bun2dArrFromKNP[tmpRowNo - 1][0] !== bunsetsuSymbol) {

        this.kihonkuArr[bunKihonkuNo] = new BunKihonku(bunKihonkuNo, kihonkuKNParr)// 文の中の通し番号での基本句array
        kihonkuKNParr = []
        bunKihonkuNo++

      } else if (tmpSurfaceForm === bunsetsuSymbol) {

        this.kihonkuArr[bunKihonkuNo] = new BunKihonku(bunKihonkuNo, kihonkuKNParr)// 文の中の通し番号での基本句array
        kihonkuKNParr = []
        bunKihonkuNo++
        this.bunsetsuArray[bunBunsetsuNo] = new Bunsetsu(bunBunsetsuNo, bunsetsuKNParr, nodeArr,this)// 文の中の通し番号での文節array

        // verb_array作成

        if (this.bunsetsuArray[bunBunsetsuNo].isVerb) {
          verbNo=this.verbArr.length
          this.verbArr.push(new BunVerb(bunBunsetsuNo, bunsetsuKNParr, bunNo,verbNo))
        }
        bunsetsuKNParr = []
        bunBunsetsuNo++

      }

      bunsetsuKNParr.push(bun2dArrFromKNP[tmpRowNo])
      kihonkuKNParr.push(bun2dArrFromKNP[tmpRowNo])
    }

    this.bunsetsuArray[bunBunsetsuNo] = new Bunsetsu(bunBunsetsuNo, bunsetsuKNParr, nodeArr,this)

    // verb_array作成

    if (this.bunsetsuArray[bunBunsetsuNo].isVerb) {
      verbNo=this.verbArr.length
      this.verbArr.push(new BunVerb(bunBunsetsuNo, bunsetsuKNParr, bunNo,verbNo))
    }
    this.kihonkuArr[bunKihonkuNo] = new BunKihonku(bunKihonkuNo, kihonkuKNParr)
    this.inputEachKakarareruBunsetsuID()
    this.inputEachKakarareruKihonkuID()

    this.surfaceForm = ""
    // this.basic_form = row_array[2]
    this.storeSurfaceForm(bun2dArrFromKNP)


    //objectかsubjectを探す。人間でなくてもいいことはないはず
    for (let tmpVerbNo = 0; tmpVerbNo < this.verbArr.length; tmpVerbNo++) {
      this.findObjectOfVerb(this.verbArr[tmpVerbNo].bunsetsuNum_inSentence, tmpVerbNo)
      //console.log(this.verbArr[tmpVerbNo].bunsetsuNum_inSentence)
      this.findSubjectOfVerb(this.verbArr[tmpVerbNo].bunsetsuNum_inSentence, tmpVerbNo,nodeArr)
      if((this.verbArr[tmpVerbNo].hasObject)&&(!this.verbArr[tmpVerbNo].hasSubject)){
        searchMaenoBunForShugo(bunArr,bunNo,tmpVerbNo,this,nodeArr)
      }
    }

    this.verbArr.forEach((verb)=>{
      verb.createBunHtml(this)
    })
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
    for(const kakaruKihonku of this.kihonkuArr){
      for (let kakarareruKihonkuCnt = 0; kakarareruKihonkuCnt < this.kihonkuArr.length; kakarareruKihonkuCnt++) {
        if (kakaruKihonku.kakatu_kihonku_id === this.kihonkuArr[kakarareruKihonkuCnt].id) {
          this.kihonkuArr[kakarareruKihonkuCnt].kakarareru_kihonku_id_array.push(kakaruKihonku.id)
          break
        }
      }
    }
  }

  findSubjectOfVerb (verbBunsetsuNo, tempVerbNum,nodeArr) {
    for (let clauseCnt = verbBunsetsuNo; clauseCnt >= 0; clauseCnt--) {
      //console.log(clauseCnt)
      let tmpClause = this.bunsetsuArray[clauseCnt]
      if (tmpClause.isSubject) {
        this.bunsetsuArray[ verbBunsetsuNo ].subject_of_verb = tmpClause.subject
        //モノホンのnodeもってこないといけない。
        console.log(tmpClause.subject)
        console.log(tmpClause.subject.nodeIdx)
        //console.log(nodeArr)
        this.verbArr[tempVerbNum].rewriteSubjectAndAddBun2Node(nodeArr[tmpClause.subject.nodeIdx], this)
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
        this.verbArr[tmpVerbNo].object = tmpBunsetsu.object
        this.verbArr[tmpVerbNo].rewriteObject(tmpBunsetsu.object)
        break
      }
    }
  }

  storeSurfaceForm(bunFromKNP){
    //やっぱり基本句から取っていく
    for(const kihonku of this.kihonkuArr){
      //console.log(kihonku)
      this.surfaceForm += kihonku.surfaceForm
      //delete kihonku.surfaceForm
    }
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