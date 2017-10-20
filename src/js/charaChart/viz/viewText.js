const viewText=(node,allBunArr)=>{
  //丸や矢印をマウスオーバーした際に、該当文章を表示。d3のmouseoverかclickから呼び出す
  for(bun of node.bunArr){
   createTextViewArea(bun,allBunArr)
  }
}

const createTextViewArea = (bun,allBunArr)=>{
  //1つ1つのTextViewAreaをつくる
  createBox()
  if(bun.idx!==0){
    addBun( allBunArr[bun.idx - 1], false)
  }
  addBun(allBunArr[bun],true)
  if(bun.idx+1!==allBunArr.length){
    addBun(allBunArr[bun.idx + 1], false)
  }
}

const createBox=()=>{
  //箱を作る
}

const addBun=(bun,bold){
  //箱に1文を追加。boldはboolean
}

export {viewText}