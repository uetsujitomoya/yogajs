const viewWhatIsClicked = (msg,arrow,node) => {
  if(arrow!==null){
    msg.innerHTML+="<font color='white'>"+arrow.subject.name+"　→　"+arrow.object.name+"　の矢印に該当する行動一覧を表示</font>"
  }
  else if(node!==null){
    msg.innerHTML+="<font color='white'>"+arrow.subject.name+"　の丸に該当する文一覧を表示</font>"
  }
}

export {viewWhatIsClicked}