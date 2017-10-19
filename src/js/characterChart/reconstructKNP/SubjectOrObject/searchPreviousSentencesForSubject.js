const searchPreviousSentencesForSubject = (verb, previousSentences)=>{
  for(const maenobun of previousSentences){
    for(const maenodoushi of maenobun){
      if(maenodoushi.hasSubject){
        verb.subject=maenodoushi.subject
      }
    }
  }
}

export {searchPreviousSentencesForSubject}