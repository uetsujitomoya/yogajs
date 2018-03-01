/**
 * Created by uetsujitomoya on 2017/08/21.
 */

import {hasJp} from "../../hasJapanese.js"
import Node from '../nodeAndArrow/Node.js'
import {charaChartRodata} from '../rodata'
import {unifyNotaion} from './unifyNotation'
import {passNotation} from './unifyNotation'

const r=charaChartRodata.nodeR
const orbitR=charaChartRodata.orbitR
const orbitOPoint = charaChartRodata.orbitOY
let nodeCnt=0
let aSanCnt=0

const charaKeyword="カテゴリ:人>"

const charaDefaultName=null

const clientColor='red'
const clientAroundPeopleColor='gray'

//Aさんを追加→1単語とする

const findChara = (knp, nodeArr) => {
  knp.forEach((row,rowNo)=>{
    if(hasJp(row[0])){

      let tmpJp = row[0]
      for(const element of row){
        if ( element.match(charaKeyword)) {
          const tmpCharaName=unifyNotaion(row[0])
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
          if(isNewChara === true){
            createNewChara(tmpCharaName,nodeArr)
          }
        }
      }

      if(row[0] === "A" || row[0] === "B" ){
        const tmpChara = row[0]
        if(isNewChara(tmpChara,nodeArr)&&aSanCnt===0){
          createNewChara(tmpChara,nodeArr,nodeArr)
        }
      }
      findSan(knp,rowNo,row,nodeArr,aSanCnt)
    }
  })
}

const isNewChara=(tmpCharaName,nodeArr)=> {

  let flag = true

  nodeArr.forEach((node)=>{

    const nodeName=node.name
    if(tmpCharaName == nodeName){
      //verbを追加
      if ( tmpCharaName.indexOf('さん') != -1) {
        //strにhogeを含む場合の処理
        //console.log(tmpCharaName)
        //console.log(node.name)
      }
      flag=false

      flag=false;
      //太さ加算
    }
  })
  return flag
}

const createNewChara=(name,nodeArr)=>{
  //Nodeを出現させるとしたらどこまでつくるかも書く
  if(name=='Aさん'){aSanCnt=1}
  //nodeArr.push(new Chara(name,nodeArr.length))
  //Nodeもここで追加する。
  if(passNotation(name)){
    nodeArr.push(new Node(name,nodeArr.length))
  }
}

const findSan=(knpArr,rowNo,row,nodeArr,aSanCnt)=>{
  if(row[0] === "さん"){
    const tmpChara = unifyNotaion(knpArr[rowNo-1][0]+row[0])

    //console.log(tmpChara)
    if(isNewChara(tmpChara,nodeArr)){
      //console.log(tmpChara)
      createNewChara(tmpChara,nodeArr)
    }
  }
}

export {findChara}
