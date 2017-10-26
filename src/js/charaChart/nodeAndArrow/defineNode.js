/**
 * Created by uetsujitomoya on 2017/08/29.
 */

let nodeCnt = 0

let r = 40
const orbitR =150
const orbitOPoint=200

const enshuBunkatsuNum = 3

export default class Node {
  constructor (name) {
    this.subject = name
    this.isSubject = false

    this.r = r
    if (this.isSubject) {
      this.strokeColor = 'red'
    } else {
      this.strokeColor = 'gray'
    }
    this.nodeCharacter = name
    this.circleStrokeWidth = 1
    this.nodeIdx=nodeCnt
    this.viz=false
    nodeCnt++
  }
  addStrokeWidth () {
    this.strokeWidth++
    this.viz=true
  }
  fixPoint(nodeArrLen){
    this.radian = (this.nodeIdx/nodeArrLen)*2*Math.PI
    this.y = orbitOPoint + orbitR * Math.sin(this.radian)
    this.x = orbitOPoint + orbitR * Math.cos(this.radian)
    r = orbitR / (nodeArrLen * 200)
  }
}

export {r}