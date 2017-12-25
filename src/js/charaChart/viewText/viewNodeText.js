import {rodata} from '../rodata'
import {addBun} from './addBun'

let preBunNo = null



const viewNodeText=(node, allBunArr)=>{//slider適用後に"allBunArr"に"selectedBunArr"が入らないように。
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  let msg = document.getElementById('box')
  msg.innerHTML=''
  console.log(node.bunArr)
  node.bunArr.forEach((bun,nodeBunArrId)=>{
    if(preBunNo!==bun.bunNo){
      createTextViewArea(bun,allBunArr,nodeBunArrId)
    }
    preBunNo=bun.bunNo
  })
}
//allBunArrのidxと中身のbunNoは一致しないゾ
const createTextViewArea = (bun,allBunArr,i)=>{
  //1つ1つのTextViewAreaをつくる
  createBox(i)
/*  for(let i=bun.bunNo-3;i<=bun.bunNo+3;i++){
    console.log(allBunArr[i])
  }*/
  if(bun.bunNo!==0&&allBunArr[ bun.bunNo - 1]!==void 0){
    if(bun.bunNo!==1&&allBunArr[ bun.bunNo - 2]!==void 0){
      if(bun.bunNo!==2&&allBunArr[ bun.bunNo - 3]!==void 0){
        addBun('msg'+i, allBunArr[ bun.bunNo - 3], false)
      }
      addBun('msg'+i, allBunArr[ bun.bunNo - 2], false)
    }
    addBun('msg'+i, allBunArr[ bun.bunNo - 1], false)
  }
  addBun('msg'+i,allBunArr[bun.bunNo], true)
  if( bun.bunNo + 1 !== allBunArr.length &&allBunArr[ bun.bunNo +1]!==void 0){
    addBun('msg'+i , allBunArr[bun.bunNo + 1], false)
    if( bun.bunNo + 2 !== allBunArr.length &&allBunArr[ bun.bunNo +2]!==void 0){
      addBun('msg'+i , allBunArr[bun.bunNo + 2], false)
      if( bun.bunNo + 3 !== allBunArr.length &&allBunArr[ bun.bunNo +3]!==void 0){
        addBun('msg'+i , allBunArr[bun.bunNo + 3], false)
      }
    }
  }
}



/*const addButton=()=>{

}*/

export {viewNodeText,createTextViewArea}