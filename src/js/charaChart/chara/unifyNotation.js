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


  return outputChara
}

export{unifyNotaion}