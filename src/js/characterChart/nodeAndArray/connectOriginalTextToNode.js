const connectOriginalTextToNode = (bunArray, nodeArray) => {
  //verbとnodeとのヒモ付の時が狙い目じゃね？
  for(const bun of bunArray){
    for(const verb of bun.verb_array){
      for(const node of nodeArray){
        if(verb.subject===node.subject){}
        //verbとnodeとのヒモ付の時が狙い目じゃね？
      }
    }
  }
}

export {connectOriginalTextToNode}