import { rodata } from '../rodata'

const addBun=(id, bun, bold)=>{
  //箱に1文を追加。boldはboolean
  console.log(id)
  console.log(bun)

  let msg = document.getElementById(id)
  //console.log(msg)
  const talker=""
  const color="#000000"
  const bunNo = bun.bunNo
  if(rodata.isToViewOnlyTxtOnlyTxt){
    const bunContent=bun.surfaceForm
  }else{
    colorVerb(bun)
  }

  if(bold){msg.innerHTML+="<b>"}
  msg.innerHTML += '<font size=' + rodata.textViewFontSize + '>' + bunNo + '' + talker + ' <font color=' + color + '>【</font>' + bunContent + '】</font><br><br>'
  if(bold){msg.innerHTML+="</b>"}
}

const colorVerb = (bun) => {
  for(const word of bun){
    if(word.isVerb){
      word.surfaceForm+="</span>"
    }
  }
}

export {addBun}