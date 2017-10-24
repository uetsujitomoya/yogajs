/**
 * Created by uetsujitomoya on 2017/08/22.
 */



let connectCharaToVerb = () => {
  //遡りまくって（再帰呼び出しして）、キャラクターにドンつくまで



}


let searchBunsetsuWithCharacter= (bunsetsuArray,VerbIncludingbunsetsuNo) => {
    for(let bunsetsuCnt=bunsetsu_num-1;bunsetsuCnt>=0;bunsetsuCnt--){
        if(/*syugo */) {
            //bunsetsuに主語orobujekutotuika
            bunsetsuArray[VerbIncludingbunsetsuNo].subject_array.push( bunsetsuArray[bunsetsuCnt].subject )
        }else if(/*object*/){
            bunsetsuArray[VerbIncludingbunsetsuNo].object_array.push( bunsetsuArray[bunsetsuCnt].object )
        }
    }
}

//search verb of subject/object

let searchSubjectOfVerb = (sentence, verbClauseNo) =>{
    //let verb_clause = sentence.bunsetsuArray[verbClauseNo]
  for(let clauseCnt = verbClauseNo; clauseCnt>=0; clauseCnt++){
      let tempClause=sentence.bunsetsuArray[clauseCnt]
      if(tempClause.includesSubject){
          sentence.bunsetsuArray[ verbClauseNo ].subject_of_verb = tempClause.subject
          break;
      }
  }
}

let searchObjectOfVerb = (sentence, verbClauseNo) =>{
    for(let clauseCnt = verbClauseNo; clauseCnt>=0; clauseCnt++){
        let tempClause=sentence.bunsetsuArray[clauseCnt]
        if(tempClause.includesObject){
            sentence.bunsetsuArray[ verbClauseNo ].object_of_verb = tempClause.object
            break;
        }
    }
}

export {searchObjectOfVerb,searchSubjectOfVerb}