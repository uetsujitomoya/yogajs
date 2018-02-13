const connectOriginalTextToNode = (bunArr, nodeArr) => {
  //verbとnodeとのヒモ付の時が狙い目じゃね？
  for(const bun of bunArr){
    for(const verb of bun.verbArr){
      for(const node of nodeArr){
        if(verb.subject===node.subject){}
        //verbとnodeとのヒモ付の時が狙い目じゃね？=>defineBunVerb
      }
    }
  }
}

export {connectOriginalTextToNode}