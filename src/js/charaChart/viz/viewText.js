import {rodata} from '../rodata'

const viewText=(node,allBunArr)=>{
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  for(const bun of node.bunArr){
    createTextViewArea(bun,allBunArr)
  }
}

const createTextViewArea = (bun,allBunArr)=>{
  console.log(bun)
  //1つ1つのTextViewAreaをつくる
  let msg = createBox()
  if(bun.bunNo!==0){
    addBun(msg, allBunArr[bun.bunNo - 1], false)
  }
  addBun(msg,allBunArr[bun.bunNo],true)
  if(bun.bunNo+1!==allBunArr.length){
    addBun(msg,allBunArr[bun.bunNo + 1], false)
  }
}

const createBox=()=>{
  //箱を作る

  let msg = document.getElementById('msg')
  let k, l
  msg.innerHTML = ''

  return msg
}

const addBun=(msg,bun,bold)=>{
  //箱に1文を追加。boldはboolean
  const talker=""
  const color="#000000"
  console.log(bun)
  const bunNo=bun.bunNo
  const bunContent=bun.surfaceForm
  msg.innerHTML += '<font size=' + rodata.textViewFontSize + '>' + bunNo + '' + talker + ' <font color=' + color + '><b>【</b></font>' + bunContent + '<b>】</b></font><br><br>'
}

export {viewText}