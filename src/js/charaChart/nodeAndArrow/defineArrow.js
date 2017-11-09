/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {connectNodeAndArrow} from './connectNodeAndArrow'

export default class Arrow {

  constructor (verb, bun) {

    //arrowにnodeデータ入れるには、verbにnodeデータ入れる必要がある。
    this.subject = verb.subject
    this.object=verb.object

    this.strokeColor = 'gray'
    this.strokeWidth = 2
    this.startPointX = 0
    this.startPointY = 0
    this.endPointX = 0
    this.endPointY = 0

    this.bunArr=[]
    connectNodeAndArrow(this)//2回やってる？？
    this.pushBunToArr(bun)
  }
  addStrokeWidth (bun) {
    this.strokeWidth = this.strokeWidth + 0.5
    this.pushBunToArr(bun)
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
}
