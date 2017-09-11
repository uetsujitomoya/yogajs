/**
 * Created by uetsujitomoya on 2017/08/28.
 */

export default class verbInSentence{
    constructor(bunsetsuNum_inSentence,bunsetsuRawArray,sentenceNum){
        this.bunsetsuNum_inSentence = bunsetsuNum_inSentence
        this.sentenceNum=sentenceNum
        this.surface_form=bunsetsuRawArray[2][0]
        this.subject =null
        this.object=null
    }
}