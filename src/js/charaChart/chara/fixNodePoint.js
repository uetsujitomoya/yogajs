const fixNodePt =(nodeArr)=> {
  //characterの母数が出揃ってからNodeの座標を決める。
 for(let node of nodeArr){
   node.fixPoint(nodeArr.length)
 }
}

export {fixNodePt}