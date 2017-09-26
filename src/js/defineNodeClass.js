/**
 * Created by uetsujitomoya on 2017/08/29.
 */

let nodeNum = 0

const enshuBunkatsuNum = 3

export default class Node {
  constructor (verb) {
    this.subject = verb.subject
    this.isSubject = false
    this.y = 200 + 150 * Math.sin((nodeNum / enshuBunkatsuNum) * 2 * Math.PI)
    this.x = 200 + 150 * Math.cos((nodeNum / enshuBunkatsuNum) * 2 * Math.PI)
    this.r = 30
    if (this.isSubject) {
      this.strokeColor = 'red'
    } else {
      this.strokeColor = 'gray'
    }
    this.nodeCharacter = verb.subject
    this.circleStrokeWidth = 1
    nodeNum++
  }
  addStrokeWidth () {
    this.strokeWidth++
  }
}
