/**
 * Created by uetsujitomoya on 2017/08/21.
 */

import {hasJapanese} from "../counselorEdu/hasJapanese.js"
import Node from './nodeAndArrow/defineNode.js'
import {rodata} from './rodata'

const r=rodata.nodeR
const orbitR=rodata.orbitR
const orbitOPoint = rodata.orbitOPoint
let nodeCnt=0
let aSanCnt=0

const charaKeyword="カテゴリ:人>"

const charaDefaultName=null

const clientColor='red'
const clientAroundPeopleColor='gray'

//Aさんを追加→1単語とする

const findChara = (knpArr, charaArr, nodeArr) => {
  knpArr.forEach((row,rowIdx)=>{
    //console.log(row)
    if(hasJapanese(row[0])){

      let tmpJapanese = row[0]
      for(const element of row){
        if ( element.match(charaKeyword)) {
          let tmpCharaName=row[0];
          let isNewChara = true
          //被ってなければその登場人物のインスタントをつくる
          charaArr.forEach((character)=>{
            if(tmpCharaName===character.name){
              //verbを追加
              isNewChara = false;
              //太さ加算
              //character.character_node.bold_qty++
            }
          })
          if(isNewChara === true){ createNewChara(tmpCharaName,charaArr,nodeArr) }
        }
      }

      if(row[0] === "さん"){
        const tmpChara = knpArr[rowIdx-1][0]+row[0]
        //console.log(tmpChara)
        if(isNewChara(tmpChara,charaArr)&&aSanCnt===0){
          createNewChara(tmpChara,charaArr,nodeArr)
        }
      }
    }
  })
}

const isNewChara=(tmpCharaName,charaArr)=> {
  charaArr.forEach((chara)=>{
    if(tmpCharaName === chara.name){
      //verbを追加
      //console.log(tmpCharaName)
      return false;
      //太さ加算
      //chara.character_node.bold_qty++
    }
  })
  return true
}

const createNewChara=(name,charaArr,nodeArr)=>{
  //Nodeを出現させるとしたらどこまでつくるかも書く
  if(name==='Aさん'){aSanCnt=1}
  charaArr.push(new Chara(name,charaArr.length))
  //Nodeもここで追加する。
  nodeArr.push(new Node(name))
}

export {findChara}

class Chara {
  constructor(name,idx) {
    this.bunArr=[]//forTextView
    this.name = name
    if(this.name === "私"||this.name==='Aさん'){
      this.client = 1
    }else{
      this.client = 0
    }
    this.nodeIdx=idx
    this.nodeX=null
    this.nodeY=null
    this.nodeCircleStrokeWidth=0
    this.r = r
    if (this.isSubject) {
      this.strokeColor = 'red'
    } else {
      this.strokeColor = 'gray'
    }
    this.nodeCharacter = name
    this.circleStrokeWidth = 0
    this.nodeIdx=nodeCnt
    this.viz=false
    this.sentenceNoArray=[]
    nodeCnt++
  }
  addStrokeWidth () {
    this.circleStrokeWidth++
    this.viz=true
  }
  fixPoint(nodeListLength){
    this.radian = (this.nodeIdx/nodeListLength)*2*Math.PI
    this.y = orbitOPoint + orbitR * Math.sin(this.radian)
    this.x = orbitOPoint + orbitR * Math.cos(this.radian)
  }
}