const searchPreviousSentencesForSubject = (sentenceArray,sentenceNo,verbNo)=>{
  for(const maenobun of previousSentences){
    for(const maenodoushi of maenobun){
      if(maenodoushi.hasSubject){
        sentenceArray[sentenceNo].verb_array[verbNo].subject=maenodoushi.subject
      }
    }
  }
}

export {searchPreviousSentencesForSubject}