/**
 * Created by uetsujitomoya on 2017/08/28.
 */
import {searchMaenoBunForShugo} from './SO/searchMaenoBunForS'

const initialValueOfSubjectAndObjectInVerb = null

export default class BunVerb {
  //クラスBun中のverb_arrayにpushされる
  constructor (bunBunsetsuId, bunsetsuRawArr, bunNo,verbNo) {
    this.bunsetsuNum_inSentence = bunBunsetsuId
    this.sentenceNum = bunNo
    //this.surfaceForm = bunsetsuRawArr[2][0]
    this.subject = null
    this.object = null
    this.hasSubject=false
    this.hasObject=false
  }
  rewriteSubjectAndAddBun2Node (realNode, bun) {
    this.subject = realNode
    realNode.bunArr.push(
      {
        bunNo: bun.bunNo,
        surfaceForm: bun.surfaceForm
      }
    )
    this.hasSubject=true
    bun.charaNameArr.push(realNode.name)
    //console.log("hasSubject!")
  }
  rewriteObject (chara) {
    this.object = chara
    this.hasObject = true
  }
}

export{initialValueOfSubjectAndObjectInVerb}