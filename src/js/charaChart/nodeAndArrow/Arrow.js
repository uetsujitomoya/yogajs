/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {definePointArr} from './connectNodeAndArrow'
import {charaChartRodata} from '../rodata'

export default class Arrow {

  constructor (verb, bun,arrowNo) {

    //arrowにnodeデータ入れるには、verbにnodeデータ入れる必要がある。
    this.arrowNo=arrowNo
    this.subject = verb.subject
    this.object=verb.object

    this.strokeColor = 'gray'
    this.strokeWidth = 2
    this.startPointX = 0
    this.startPointY = 0
    this.endPointX = 0
    this.endPointY = 0

    this.redPt=0
    this.bluePt=0

    this.bunArr=[]
    this.verbBunHtmlArr=[]
    definePointArr(this)//2回やってる？？
    this.pushBunToArr(bun,verb)
    this.updateColor(verb.isBlueArrowColor)

  }

  updateColor(isBlueArrowColor){
    if(isBlueArrowColor==1){//==
      //this.isBlue=true
      this.bluePt++
    }else{
      //this.isBlue=false
      this.redPt++
    }

    if(this.bluePt>this.redPt){
      this.isBlue=true
    }else{
      this.isBlue=false
    }

  }

  addStrokeWidth (bun,verb) {
    this.strokeWidth = this.strokeWidth + 1
    this.pushBunToArr(bun,verb)
    this.updateColor(verb.isBlueArrowColor)
  }
  pushBunToArr(bun,verb){
    //console.log(verb)
    this.bunArr.push(
      {
        //surfaceForm:bun.surfaceForm,
        surfaceForm:verb.bunHtml,
        bunNo:bun.bunNo
      }
    )
  }
  colorBlue(){
    this.strokeColor="#0000ff"
    localStorage.setItem("矢印"+this.arrowNo,"文句批難愚痴")
  }
  colorRed(){
    this.strokeColor="#ff0000"
    localStorage.setItem(charaChartRodata.csvPath+"矢印"+this.arrowNo,"感謝貢献")
  }
}
