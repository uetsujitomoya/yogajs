/**
 * Created by uetsujitomoya on 2017/08/29.
 */

export default class Arrow {
  constructor (verb, arrowNum, svg) {
    this.subject = verb.subject
    this.object = verb.object

    this.strokeColor = 'gray'
    this.arrowStrokeWidth = 1
    this.startPointX = 0
    this.startPointY = 0
    this.endPointX = 0
    this.endPointY = 0
  }
  addStrokeWidth () {
    this.strokeWidth++
  }
}
