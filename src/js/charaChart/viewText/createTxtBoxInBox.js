import { setting } from '../setting'

const createTxtBoxInBox=(i, bigBoxId)=>{
  //箱を作る

  let msg = document.getElementById(bigBoxId)
  msg.innerHTML += '<div id="msg' + i +'" style="border-width: 1px; background-color:#ffffff; width:'+setting.boxInBoxWidth+'; overflow-y:scroll; margin-bottom: 5px; margin-left: 5px; margin-top: 10px; padding-bottom: 5px; padding-top: 5px;">'
}

export {createTxtBoxInBox}