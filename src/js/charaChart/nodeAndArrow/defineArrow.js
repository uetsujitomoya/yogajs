/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {connectNodeAndArrow} from './connectNodeAndArrow'

export default class Arrow {
  constructor (verb, arrowNum, svg) {
    console.log(verb)
    //arrowにnodeデータ入れるには、verbにnodeデータ入れる必要がある。
    this.subject = {
      name:verb.subject,
      nodeIdx:verb.subject.nodeIdx,
      x:verb.subject.x,
      y:verb.subject.y
    }
    this.object={name:verb.object,nodeIdx:verb.object.nodeIdx,
      x:verb.object.x,
      y:verb.object.y}

    this.strokeColor = 'gray'
    this.arrowStrokeWidth = 1
    this.startPointX = 0
    this.startPointY = 0
    this.endPointX = 0
    this.endPointY = 0
    connectNodeAndArrow(this)
  }
  addStrokeWidth () {
    this.strokeWidth++
  }
}
