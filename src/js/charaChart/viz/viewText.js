import {rodata} from '../rodata'

const viewText=(node,allBunArr)=>{
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  for(bun of node.bunArr){
    createTextViewArea(bun,allBunArr)
  }
}

const createTextViewArea = (bun,allBunArr)=>{
  //1つ1つのTextViewAreaをつくる
  createBox()
  if(bun.idx!==0){
    addBun( allBunArr[bun.idx - 1], false)
  }
  addBun(allBunArr[bun],true)
  if(bun.idx+1!==allBunArr.length){
    addBun(allBunArr[bun.idx + 1], false)
  }
}

const createBox=()=>{
  //箱を作る

  var msg = document.getElementById('msg')
  let k, l
  msg.innerHTML = ''

}

const addBun=(msg,talker,color,bunNo,bunContent,bold)=>{
  //箱に1文を追加。boldはboolean
  msg.innerHTML += '<font size=' + rodata.textViewFontSize + '>' + bunNo + '' + talker + ' <font color=' + color + '><b>【</b></font>' + bunContent + '<b>】</b></font><br><br>'
}

export {viewText}