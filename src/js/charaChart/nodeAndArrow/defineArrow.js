/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {connectNodeAndArrow} from './connectNodeAndArrow'

export default class Arrow {

  constructor (verb, arrowNo, svg) {

    //arrowにnodeデータ入れるには、verbにnodeデータ入れる必要がある。
    this.subject = {
      name:verb.subject,
      nodeIdx:verb.subject.nodeIdx,
      x:verb.subject.x,
      y:verb.subject.y
    }
    this.object={
      name:verb.object,
      nodeIdx:verb.object.nodeIdx,
      x:verb.object.x,
      y:verb.object.y
    }

    this.strokeColor = 'gray'
    this.strokeWidth = 5
    this.startPointX = 0
    this.startPointY = 0
    this.endPointX = 0
    this.endPointY = 0
    connectNodeAndArrow(this)//2回やってる？？
    console.log(this)
  }
  addStrokeWidth () {
    this.strokeWidth = this.strokeWidth + 5
  }
}
