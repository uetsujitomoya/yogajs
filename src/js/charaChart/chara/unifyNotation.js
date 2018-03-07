//登場人物の表記ゆれを修正する

const unifyNotaion=(inputChara)=>{
  let outputChara=inputChara

  if(inputChara==='はは' || inputChara==="母親" || inputChara==="母さん"){
    outputChara="母"
  }
  if(inputChara==="父さん"){
    outputChara="父"
  }
  if(inputChara==="神"){
    outputChara="神さま"
  }
  if(inputChara==="姉さん"){
    outputChara="姉"
  }
  if(inputChara==="Ａさん"||inputChara==="自分"||inputChara==="私"){
    outputChara="Aさん"
  }
  if(inputChara==="店長さん"){
    outputChara="店長"
  }

  return outputChara
}

const passNotation=(inputChara)=>{

  const noNeedArr=[
    "男性",
    "人",
    "客さん",
    "相手",
    "本人",
    "自身",
    "誰",
    "あなた",
    "人間",
    "相手さん",
    "ふ",
    "お前",
    "あんた",
    "者",
    "僕",
    "長",
    "プロ",
    "個人",
    "人物",
    "ミス",
    "小学生",
    "神さま",
    "西郷さん",
    "女性",
    "友人",
    "客",
    "皆さん"
  ]

  if( noNeedArr.lastIndexOf(inputChara) >= 0 ){
    return false
  }else{
    return true
  }

}

export{unifyNotaion,passNotation}