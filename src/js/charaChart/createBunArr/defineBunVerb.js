/**
 * Created by uetsujitomoya on 2017/08/28.
 */
import {searchMaenoBunForShugo} from './SO/searchMaenoBunForS'

const initialValueOfSubjectAndObjectInVerb = null

export default class BunVerb {
  //クラスBun中のverb_arrayにpushされる
  constructor (bunsetsuIdxInSentence, bunsetsuRawArray, bunNo,verbNo) {
    this.bunsetsuNum_inSentence = bunsetsuIdxInSentence
    this.sentenceNum = bunNo
    this.surfaceForm = bunsetsuRawArray[2][0]
    this.subject = null
    this.object = null
    this.hasSubject=false
    this.hasObject=false
  }
  rewriteSubject (character) {
    this.subject = character
    this.hasSubject=true
    console.log("hasSubject!")
  }
  rewriteObject (character) {
    this.object = character
    this.hasObject = true
    console.log("hasObject!")
  }
}

export{initialValueOfSubjectAndObjectInVerb}