/**
 * Created by uetsujitomoya on 2017/08/28.
 */

const initialValueOfSubjectAndObjectInVerb = null

/*export default class verbInSentence {
  constructor (bunsetsuNum_inSentence, bunsetsuRawArray, sentenceNum) {
    this.bunsetsuNum_inSentence = bunsetsuNum_inSentence
    this.sentenceNum = sentenceNum
    this.surface_form = bunsetsuRawArray[2][0]
    this.subject = initialValueOfSubjectAndObjectInVerb
    this.object = initialValueOfSubjectAndObjectInVerb
  }
}*/


export default class verbInSentence {
  constructor (bunsetsuIdxInSentence, bunsetsuRawArray, sentenceIdx) {
    this.bunsetsuNum_inSentence = bunsetsuIdxInSentence
    this.sentenceNum = sentenceIdx
    this.surface_form = bunsetsuRawArray[2][0]
    this.subject = null
    this.object = null
  }
  rewriteSubject (character) {
    //console.log(character)
    this.subject = character
  }
  rewriteObject (character) {
    //console.log(character)
    this.object = character
  }
}

export{initialValueOfSubjectAndObjectInVerb}