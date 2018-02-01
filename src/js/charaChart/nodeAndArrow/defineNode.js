/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {setting } from '../setting'

let r
const orbitR=setting.orbitR
//onst orbitOPoint = setting.orbitOY

let nodeCnt = 0
/*
let r = 40
const orbitR =150
const orbitOY=200*/

const enshuBunkatsuNum = 3

export default class Node {
  constructor (name,idx) {
    this.name=name
    this.subject = name
    if(name==="私"||name==="Aさん"||name==="自分"){
      this.isClient=true
    }else{
      this.isClient=false
    }
    this.bunArr=[]

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
    this.circleStrokeWidth = this.circleStrokeWidth + 0.5
    this.viz=true
  }
  fixPoint(nodeArrLen){
    this.radian = (this.nodeIdx/nodeArrLen)*2*Math.PI
    this.x = setting.orbitOX + orbitR * Math.cos(this.radian)
    this.y = setting.orbitOY - orbitR * Math.sin(this.radian)
    r = orbitR / (nodeArrLen * 200)
  }
  pushToBunArr(bun){

  }
}

export {r}