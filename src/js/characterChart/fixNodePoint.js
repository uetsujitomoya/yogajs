const fixNodePoint =(characterArrayLength,nodeArray)=> {
  //characterの母数が出揃ってからNodeの座標を決める。

  nodeArray.forEach((node,nodeIdx)=>{
    node.y = 200 + 150 * Math.sin((nodeIdx / characterArrayLength) * 2 * Math.PI)
    node.x = 200 + 150 * Math.cos((nodeIdx / characterArrayLength) * 2 * Math.PI)
  })
}

export {fixNodePoint}