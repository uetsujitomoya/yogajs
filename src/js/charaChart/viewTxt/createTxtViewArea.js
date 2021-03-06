import { charaChartRodata } from '../rodata'

const createTxtViewArea = (bun, allBunArr, i,verbBunHtml,isArrow)=>{

  //console.log(verbBunHtml)
  //1つ1つのTextViewAreaをつくる
  createBox(i)
  /*  for(let i=bun.bunNo-3;i<=bun.bunNo+3;i++){
      console.log(allBunArr[i])
    }*/
  if(bun.bunNo!==0&&allBunArr[ bun.bunNo - 1]!==void 0){
    if(bun.bunNo!==1&&allBunArr[ bun.bunNo - 2]!==void 0){
      if(bun.bunNo!==2&&allBunArr[ bun.bunNo - 3]!==void 0){
        addBun('msg'+i, allBunArr[ bun.bunNo - 3], false)
      }
      addBun('msg'+i, allBunArr[ bun.bunNo - 2], false)
    }
    addBun('msg'+i, allBunArr[ bun.bunNo - 1], false)
  }


  //addBun('msg'+i,allBunArr[bun.bunNo], true)
  addWatchingBun(i,bun,true,verbBunHtml,isArrow)


  if( bun.bunNo + 1 !== allBunArr.length &&allBunArr[ bun.bunNo +1]!==void 0){
    addBun('msg'+i , allBunArr[bun.bunNo + 1], false)
    if( bun.bunNo + 2 !== allBunArr.length &&allBunArr[ bun.bunNo +2]!==void 0){
      addBun('msg'+i , allBunArr[bun.bunNo + 2], false)
      if( bun.bunNo + 3 !== allBunArr.length &&allBunArr[ bun.bunNo +3]!==void 0){
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

const addBun=(id,bun,bold,verbBunHtml,isArrow)=>{
  //箱に1文を追加。boldはboolean
  let msg = document.getElementById(id)
  const talker=""
  const color="#000000"
  const bunNo = bun.bunNo
  const bunContent=bun.surfaceForm
  //if(bold){msg.innerHTML+="<b>"}
  msg.innerHTML += '<font size=' + charaChartRodata.txtViewFontSize + '>' + bunNo + '' + talker + ' <font color=' + color + '>【</font>'
  if(isArrow){
    msg.innerHTML +=  verbBunHtml
  }else{
    if(bold){
      //console.log("bold")
      msg.innerHTML += "<u>" + bunContent +"</u>"

    }else{
      msg.innerHTML +=  bunContent
    }
  }
  msg.innerHTML += '】</font><br><br>'
  //if(bold){msg.innerHTML+="</b>"}
}

const addWatchingBun = (i,bun,isBold,verbBunHtml,isArrow) => {

  if(isArrow){
    addBun('msg'+i,bun, true,verbBunHtml,true)
  }else{
    addBun('msg'+i,bun, true,null,false)
  }
}

export{createTxtViewArea}