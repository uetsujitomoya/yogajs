/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {connectNodeAndArrow} from './connectNodeAndArrow'

export default class Arrow {

  constructor (verb, arrowNum, svg) {

    //arrowにnodeデータ入れるには、verbにnodeデータ入れる必要がある。
    this.subject = {
      name:verb.subject,
      nodeIdx:verb.subject.nodeIdx,
      x:verb.subject.x,
      y:verb.subject.y,
      isClient:verb.subject.isClient
    }
    this.object={
      name:verb.object,
      nodeIdx:verb.object.nodeIdx,
      x:verb.object.x,
      y:verb.object.y
    }

    this.strokeColor = 'gray'
    this.strokeWidth = 2
    this.startPointX = 0
    this.startPointY = 0
    this.endPointX = 0
    this.endPointY = 0
    connectNodeAndArrow(this)//2回やってる？？
  }
  addStrokeWidth () {
    this.strokeWidth = this.strokeWidth + 2
  }
}
