import {createTxtViewArea} from './createTxtViewArea'
import { rodata } from '../rodata'

let preBunNo=null

const viewArrowTxt = (arrow, allBunArr) => {//slider適用後に"allBunArr"に"selectedBunArr"が入らないように。
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  if(!rodata.isOnlyViz){
    let msg = document.getElementById('box')
    msg.innerHTML=''
    console.log(arrow)
    arrow.bunArr.forEach((bun,arrowBunArrId)=>{
      if(preBunNo!==bun.bunNo){
        createTxtViewArea(bun,allBunArr,arrowBunArrId,verbBunHtml,true)
      }
      preBunNo=bun.bunNo
    })
  }
}

export {viewArrowTxt}