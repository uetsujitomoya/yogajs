/**
 * Created by uetsujitomoya on 2017/08/28.
 */
import {searchMaenoBunForShugo} from './SO/searchMaenoBunForS'

const initialValueOfSubjectAndObjectInVerb = null

/*export default class BunVerb {
  constructor (bunsetsuNum_inSentence, bunsetsuRawArray, sentenceNum) {
    this.bunsetsuNum_inSentence = bunsetsuNum_inSentence
    this.sentenceNum = sentenceNum
    this.surfaceForm = bunsetsuRawArray[2][0]
    this.subject = initialValueOfSubjectAndObjectInVerb
    this.object = initialValueOfSubjectAndObjectInVerb
  }
}*/


export default class BunVerb {
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
    //console.log(character)
    this.subject = character
    this.hasSubject=true
  }
  rewriteObject (character) {
    //console.log(character)
    this.object = character
    this.hasObject=true
  }

}

export{initialValueOfSubjectAndObjectInVerb}