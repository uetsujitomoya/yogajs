/**
 * Created by uetsujitomoya on 2017/08/21.
 */

import {hasJp} from "../../counselorEdu/hasJapanese.js"
import Node from '../nodeAndArrow/defineNode.js'
import {rodata} from '../rodata'
import {unifyNotaion} from './unifyNotation'

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
            console.log(tmpCharaName)
            createNewChara(tmpCharaName,nodeArr)
          }
        }
      }

      if(row[0] == "A" || row[0] == "B" ){
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

      return false
      //太さ加算
    }
  })
  if(flag===true){
    return true
  }

}

const createNewChara=(name,nodeArr)=>{
  //Nodeを出現させるとしたらどこまでつくるかも書く
  if(name=='Aさん'){aSanCnt=1}
  //nodeArr.push(new Chara(name,nodeArr.length))
  //Nodeもここで追加する。
  nodeArr.push(new Node(name,nodeArr.length))
}

const findSan=(knpArr,rowNo,row,nodeArr,aSanCnt)=>{
  if(row[0] === "さん"){
    const tmpChara = knpArr[rowNo-1][0]+row[0]
    //console.log(tmpChara)
    if(isNewChara(tmpChara,nodeArr)){
      //console.log(tmpChara)
      createNewChara(tmpChara,nodeArr)
    }
  }
}

export {findChara}
