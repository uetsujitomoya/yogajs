/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {connectNodeAndArrow} from './connectNodeAndArrow'
import {rodata} from '../rodata'

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

    this.redPoint=0
    this.bluePoint=0

    this.bunArr=[]
    connectNodeAndArrow(this)//2回やってる？？
    this.pushBunToArr(bun)
    this.updateColor(verb.isBlueArrowColor)

  }

  updateColor(isBlueArrowColor){
    if(isBlueArrowColor==1){//==
      //this.isBlue=true
      this.bluePoint++
    }else{
      //this.isBlue=false
      this.redPoint++
    }

    if(this.bluePoint>this.redPoint){
      this.isBlue=true
    }else{
      this.isBlue=false
    }

  }

  addStrokeWidth (bun,verb) {
    this.strokeWidth = this.strokeWidth + 0.5
    this.pushBunToArr(bun)
    this.updateColor(verb.isBlueArrowColor)
  }
  pushBunToArr(bun){
    //console.log(bun)
    this.bunArr.push(
      {
        surfaceForm:bun.surfaceForm,
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
    localStorage.setItem(rodata.csvPath+"矢印"+this.arrowNo,"感謝貢献")
  }
}
