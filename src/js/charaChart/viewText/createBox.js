const createBox=(i)=>{
  //箱を作る

  let msg = document.getElementById('box')
  msg.innerHTML += '<div id="msg' + i +'" style="border-width: 1px; background-color:#ffffff; width:600px; overflow-y:scroll; margin-bottom: 5px; margin-left: 5px; margin-top: 10px; padding-bottom: 5px; padding-top: 5px;">'
}

export {createBox}