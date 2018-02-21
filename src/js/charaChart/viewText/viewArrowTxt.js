import {createTxtViewArea} from './createTxtViewArea'
import { charaChartSetting } from '../setting'
import { nowWatchingArrowOrNode } from '../nowWatchingArrowOrNode'
import { viewWhatIsClicked } from './viewWhatIsClicked'

let preBunNo=null

const viewArrowTxt = (arrow, allBunArr) => {
  if(!charaChartSetting.isOnlyViz){
    nowWatchingArrowOrNode.arrow={
      subject:arrow.subject.name,
      object:arrow.object.name
    }
    nowWatchingArrowOrNode.node=null

    let msg = document.getElementById('box')
    msg.innerHTML=''

    viewWhatIsClicked(msg,null,nowWatchingArrowOrNode.node)

    arrow.bunArr.forEach((bun,arrowBunArrId)=>{
      if(preBunNo!==bun.bunNo){
        createTxtViewArea(bun,allBunArr,arrowBunArrId,bun.surfaceForm,true)
      }
      preBunNo=bun.bunNo
    })
  }
}

export {viewArrowTxt}