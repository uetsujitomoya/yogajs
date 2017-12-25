import { rodata } from '../rodata'

const addBun=(id, bun, bold)=>{
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

export {addBun}