/**
 * Created by uetsujitomoya on 2017/08/28.
 */
import {searchMaenoBunForShugo} from './SO/searchMaenoBunForS'
import { isVerb } from './isVerb'
import { isKihonkuIncludingTheVerb } from './isKihonkuIncludingTheVerb'

const initialValueOfSubjectAndObjectInVerb = null
let i=0
export default class BunVerb {
  //クラスBun中のverb_arrayにpushされる
  constructor (bunBunsetsuId, bunsetsuRawArr, bunNo,verbNo) {
/*
    if(i<3){
      console.log(bunBunsetsuId)
      console.log(bunsetsuRawArr)
      console.log(bunNo)
      console.log(verbNo)
    }
*/

    i++
    this.bunsetsuNum_inSentence = bunBunsetsuId
    this.sentenceNum = bunNo
    this.surfaceForm = bunsetsuRawArr[2][0]
    this.subject = null
    this.object = null
    this.hasSubject=false
    this.hasObject=false
    this.bunHtml="" //原文表示用
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
  createBunHtml(bun){
    //bunが出来てから、Bun自体のbunSurfaceFromとともに作る
    //console.log(bun.kihonkuArr)
    //やっぱり基本句から取っていく
    for(const kihonku of bun.kihonkuArr){
      //console.log(kihonku)
      if(isKihonkuIncludingTheVerb(kihonku,this)){
        //console.log(this)
        this.bunHtml += "<u><b>"
        //console.log(this.bunHtml)
      }
      this.bunHtml += kihonku.surfaceForm

      if(isKihonkuIncludingTheVerb(kihonku,this)){
        this.bunHtml += "</b></u>"
      }
    }
  }
}

export{initialValueOfSubjectAndObjectInVerb}