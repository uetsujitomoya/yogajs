const fixNodePoint =(nodeArray)=> {
  //characterの母数が出揃ってからNodeの座標を決める。
 for(let node of nodeArray){
   node.fixPoint(nodeArray.length)
 }


}

export {fixNodePoint}