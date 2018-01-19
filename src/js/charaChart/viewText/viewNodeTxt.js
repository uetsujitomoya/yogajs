import {rodata} from '../rodata'
import { createTxtViewArea } from './createTxtViewArea'
import { nowWatchingArrowOrNode } from '../nowWatchingArrowOrNode'

let preBunNo = null

const viewNodeTxt=(node, allBunArr)=>{//slider適用後に"allBunArr"に"selectedBunArr"が入らないように。
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す

  nowWatchingArrowOrNode.node=node
  nowWatchingArrowOrNode.arrow=null

  if(!rodata.isOnlyViz){
    let msg = document.getElementById('box')
    msg.innerHTML=''
    console.log(node.bunArr)
    node.bunArr.forEach((bun,nodeBunArrId)=>{
      if(preBunNo!==bun.bunNo){
        createTxtViewArea(bun,allBunArr,nodeBunArrId)
      }
      preBunNo=bun.bunNo
    })
  }

}
//allBunArrのidxと中身のbunNoは一致しないゾ


const addButton=()=>{

}

export {viewNodeTxt,createTxtViewArea}