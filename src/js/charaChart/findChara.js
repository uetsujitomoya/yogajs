/**
 * Created by uetsujitomoya on 2017/08/21.
 */

import {hasJp} from "../counselorEdu/hasJapanese.js"
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

const findChara = (knpArr, nodeArr) => {
  knpArr.forEach((row,rowIdx)=>{

    //console.log(row)
    if(hasJp(row[0])){

      let tmpJp = row[0]
      for(const element of row){
        if ( element.match(charaKeyword)) {
          let tmpCharaName=row[0];
          let isNewChara = true
          //被ってなければその登場人物のインスタントをつくる
          nodeArr.forEach((node)=>{
            if(tmpCharaName===node.name){
              //verbを追加
              isNewChara = false;
              //太さ加算
              //node.character_node.bold_qty++
            }
          })
          if(isNewChara === true){ createNewChara(tmpCharaName,nodeArr) }
        }
      }

      if(row[0] === "さん"){
        const tmpChara = knpArr[rowIdx-1][0]+row[0]
        //console.log(tmpChara)
        if(isNewChara(tmpChara,nodeArr)&&aSanCnt===0){
          createNewChara(tmpChara,nodeArr,nodeArr)
        }
      }
    }
  })
}

const isNewChara=(tmpCharaName,nodeArr)=> {
  nodeArr.forEach((node)=>{
    if(tmpCharaName === node.name){
      //verbを追加

      return false;
      //太さ加算
    }
  })
  return true
}

const createNewChara=(name,nodeArr)=>{
  //Nodeを出現させるとしたらどこまでつくるかも書く
  if(name==='Aさん'){aSanCnt=1}
  //nodeArr.push(new Chara(name,nodeArr.length))
  //Nodeもここで追加する。
  nodeArr.push(new Node(name,nodeArr.length))
}

export {findChara}
