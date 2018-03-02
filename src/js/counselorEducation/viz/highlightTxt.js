const highlightTxt=(target,txt,group)=>{
  target.innerHTML+="<mark class='"+group+"'>" +txt+"</mark>"
}
export {highlightTxt}