/**
 * Created by uetsujitomoya on 2017/08/21.
 */

import {contains_japanese} from "../contains_japanese.js"
import Node from './nodeAndArray/defineNode.js'
import {rodata} from '../rodata'

const r=rodata.nodeR
const orbitR=rodata.orbitR
const orbitOPoint = rodata.orbitOPoint
let nodeCnt=0

const characterKeyword="カテゴリ:人>"

const characterDefaultName=null

const color_of_client='red'
const color_of_people_around_client='gray'

//Aさんを追加→1単語とする

const findCharacter = (knpArray, characterArray, nodeArray) => {
  knpArray.forEach((row,rowIdx)=>{
    //console.log(row)
    if(contains_japanese(row[0])){

      let temp_japanese = row[0]
      for(const element of row){
        if ( element.match(characterKeyword)) {
          let temp_character_name=row[0];
          let isNewCharacter = true
          //被ってなければその登場人物のインスタントをつくる
          characterArray.forEach((character)=>{
            if(temp_character_name===character.name){
              //verbを追加
              isNewCharacter = false;
              //太さ加算
              //character.character_node.bold_qty++
            }
          })
          if(isNewCharacter === true){ createNewCharacter(temp_character_name,characterArray,nodeArray) }
        }
      }

      if(row[0] === "さん"){
        const tempCharacter = knpArray[rowIdx-1][0]+row[0]
        if(isNewCharacter(tempCharacter,characterArray)){
          createNewCharacter(tempCharacter,characterArray,nodeArray)
        }
      }
    }
  })
}

const isNewCharacter=(tempCharacterName,characterArray)=> {
  characterArray.forEach((character)=>{
    if(tempCharacterName === character.name){
      //verbを追加
      return false;
      //太さ加算
      //character.character_node.bold_qty++
    }
  })
  return true
}

const createNewCharacter=(name,characterArray,nodeArray)=>{
  //Nodeを出現させるとしたらどこまでつくるかも書く
  characterArray.push(new Character(name,characterArray.length))
  //Nodeもここで追加する。
  nodeArray.push(new Node(name))
}

/*class character{
  constructor(name,arrayLength){
    this.chalacter_name=characterDefaultName
    this.isClient=false
    this.character_node = new Node(character_name,sentence,this.isClient)
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
    nodeCnt++
  }
  addStrokeWidth () {
    this.strokeWidth++
    this.viz=true
  }
  fixPoint(nodeListLength){
    this.radian = (this.nodeIdx/nodeListLength)*2*Math.PI
    this.y = orbitOPoint + orbitR * Math.sin(this.radian)
    this.x = orbitOPoint + orbitR * Math.cos(this.radian)
  }
}*/

/*
class Node{
  constructor(character_name,sentence,isClient){
    //this.character=character
    this.node_r=0
    this.node_x=0
    this.node_y=0
    this.node_text=character_name
    this.bold_qty=1
    if(isClient){
      this.node_color=color_of_client
    }else{
      this.node_color=color_of_people_around_client
    }

  }
}
*/

let add_bold_of_node = () => {

}

export {findCharacter}

class Character {
  constructor(name,idx) {
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
    nodeCnt++
  }
  addStrokeWidth () {
    this.strokeWidth++
    this.viz=true
  }
  fixPoint(nodeListLength){
    this.radian = (this.nodeIdx/nodeListLength)*2*Math.PI
    this.y = orbitOPoint + orbitR * Math.sin(this.radian)
    this.x = orbitOPoint + orbitR * Math.cos(this.radian)

  }
}