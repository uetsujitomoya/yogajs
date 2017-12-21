import {createTextViewArea} from './viewNodeText'

let preBunNo=null

const viewArrowText = (arrow,allBunArr) => {//slider適用後に"allBunArr"に"selectedBunArr"が入らないように。
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  let msg = document.getElementById('box')
  msg.innerHTML=''
  console.log(arrow)
  arrow.bunArr.forEach((bun,arrowBunArrId)=>{
    if(preBunNo!==bun.bunNo){
      createTextViewArea(bun,allBunArr,arrowBunArrId)
    }
    preBunNo=bun.bunNo
  })
}

export {viewArrowText}