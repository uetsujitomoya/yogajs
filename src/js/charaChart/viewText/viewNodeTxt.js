import {rodata} from '../rodata'
import { createTxtViewArea } from './createTxtViewArea'
import { nowWatchingArrowOrNode } from '../nowWatchingArrowOrNode'

let preBunNo = null

const viewNodeTxt=(node, allBunArr)=>{
  nowWatchingArrowOrNode.node=node
  nowWatchingArrowOrNode.arrow=null
  if(!rodata.isOnlyViz){
    let msg = document.getElementById('box')
    msg.innerHTML=''
    node.bunArr.forEach((bun,nodeBunArrId)=>{
      if(preBunNo!==bun.bunNo){
        createTxtViewArea(bun,allBunArr,nodeBunArrId)
      }
      preBunNo=bun.bunNo
    })
  }
}


const addButton=()=>{

}

export {viewNodeTxt,createTxtViewArea}