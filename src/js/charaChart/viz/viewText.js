import {rodata} from '../rodata'

const viewText=(node,allBunArr)=>{
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  node.bunArr.forEach((bun,i)=>{
    createTextViewArea(bun,allBunArr,i)
  })
}

const createTextViewArea = (bun,allBunArr,i)=>{
  //1つ1つのTextViewAreaをつくる
  createBox(i)
  if(bun.bunNo!==0){
    addBun('msg'+i, allBunArr[bun.bunNo - 1], false)
  }
  addBun('msg'+i,allBunArr[bun.bunNo],true)
  if(bun.bunNo+1!==allBunArr.length){
    addBun('msg'+i , allBunArr[bun.bunNo + 1], false)
  }
}

const createBox=(i)=>{
  //箱を作る

  let msg = document.getElementById('box')
  msg.innerHTML += '<div id="msg' + i +'" style="border-style: solid; border-width: 1px; border-color:#2c3e50; height:300px; width:600px; overflow-y:scroll floet:left;">'
}

const addBun=(id,bun,bold)=>{
  //箱に1文を追加。boldはboolean
  let msg = document.getElementById(id)
  const talker=""
  const color="#000000"
  console.log(bun)
  const bunNo=bun.bunNo
  const bunContent=bun.surfaceForm
  msg.innerHTML += '<font size=' + rodata.textViewFontSize + '>' + bunNo + '' + talker + ' <font color=' + color + '><b>【</b></font>' + bunContent + '<b>】</b></font><br><br>'
}

export {viewText}