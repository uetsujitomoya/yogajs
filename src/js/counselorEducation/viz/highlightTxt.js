const highlightTxt=(target,txt,className)=>{
  target.innerHTML+="<mark class='"+className+"'>" +txt+"</mark>"
}
export {highlightTxt}