import {charaChartRodata} from '../rodata'
import { createTxtViewArea } from './createTxtViewArea'
import { nowWatchingArrowOrNode } from '../nowWatchingArrowOrNode'
import { viewWhatIsClicked } from './viewWhatIsClicked'

let preBunNo = null

const viewNodeTxt=(node, allBunArr)=>{
  nowWatchingArrowOrNode.node=node
  nowWatchingArrowOrNode.arrow=null
  if(!charaChartRodata.isOnlyViz){
    let msg = document.getElementById('box')
    msg.innerHTML=''

    viewWhatIsClicked(msg,nowWatchingArrowOrNode.arrow,null)

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