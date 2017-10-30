import {rodata} from '../rodata'

const viewText=(node,allBunArr)=>{
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  let msg = document.getElementById('box')
  msg.innerHTML=''
  node.bunArr.forEach((bun,i)=>{
    createTextViewArea(bun,allBunArr,i)
  })
}

const createTextViewArea = (bun,allBunArr,i)=>{
  //1つ1つのTextViewAreaをつくる
  createBox(i)
  if(bun.bunNo!==0){
    if(bun.bunNo!==1){
      if(bun.bunNo!==2){
        addBun('msg'+i, allBunArr[ bun.bunNo - 3], false)
      }
      addBun('msg'+i, allBunArr[ bun.bunNo - 2], false)
    }
    addBun('msg'+i, allBunArr[ bun.bunNo - 1], false)
  }
  addBun('msg'+i,allBunArr[bun.bunNo], true)
  if( bun.bunNo + 1 !== allBunArr.length ){
    addBun('msg'+i , allBunArr[bun.bunNo + 1], false)
    if( bun.bunNo + 2 !== allBunArr.length ){
      addBun('msg'+i , allBunArr[bun.bunNo + 2], false)
      if( bun.bunNo + 3 !== allBunArr.length ){
        addBun('msg'+i , allBunArr[bun.bunNo + 3], false)
      }
    }
  }
}

const createBox=(i)=>{
  //箱を作る
  let msg = document.getElementById('box')
  msg.innerHTML += '<div id="msg' + i +'" style="border-width: 1px; background-color:#ffffff; width:600px; overflow-y:scroll; margin-bottom: 5px; margin-left: 5px; margin-top: 10px; padding-bottom: 5px; padding-top: 5px;">'
}

const addBun=(id,bun,bold)=>{
  //箱に1文を追加。boldはboolean

  let msg = document.getElementById(id)
  const talker=""
  const color="#000000"
  const bunNo = bun.bunNo
  const bunContent=bun.surfaceForm
  if(bold){msg.innerHTML+="<b>"}
  msg.innerHTML += '<font size=' + rodata.textViewFontSize + '>' + bunNo + '' + talker + ' <font color=' + color + '>【</font>' + bunContent + '】</font><br><br>'
  if(bold){msg.innerHTML+="</b>"}
}

export {viewText}