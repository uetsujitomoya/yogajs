/**
 * Created by uetsujitomoya on 2017/08/29.
 */

import {charaChartRodata } from '../rodata'

let r
const orbitR=charaChartRodata.orbitR
let nodeCnt = 0
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
    this.nodeIdx=charaChartRodata.nodeCnt
    this.viz=false

    this.bluePt=0
    this.redPt=0
    //this.updateColor(verb.isBlueCircleColor)

    charaChartRodata.nodeCnt++
  }

  addStrokeWidth () {
    this.circleStrokeWidth = this.circleStrokeWidth + 0.5
    this.viz=true
  }
  fixPoint(nodeArrLen){
    this.radian = (this.nodeIdx/nodeArrLen)*2*Math.PI
    this.x = charaChartRodata.orbitOX + orbitR * Math.cos(this.radian)
    this.y = charaChartRodata.orbitOY - orbitR * Math.sin(this.radian)
    r = orbitR / (nodeArrLen * 200)
  }
  pushToBunArr(bun){

  }
  updatePropaties(isBlueCircleColor){
    this.circleStrokeWidth++
    this.updateColor(isBlueCircleColor)
  }
  updateColor(isBlueCircleColor){
    console.log(isBlueCircleColor)
    if(isBlueCircleColor==1){//==
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
}

export {r}