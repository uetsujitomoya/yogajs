const highlightTxt=(target,txt,color)=>{
  //target.innerHTML+="<mark class='"+color+"'>" +txt+"</mark>"
  target.innerHTML+="<mark style='background-color:"+color+";'>" +txt+"</mark>"
}
export {highlightTxt}