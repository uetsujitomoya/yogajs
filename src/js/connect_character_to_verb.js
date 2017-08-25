/**
 * Created by uetsujitomoya on 2017/08/22.
 */



let connect_character_to_verb = () => {
  //遡りまくって（再帰呼び出しして）、キャラクターにドンつくまで



}


let search_bunsetsu_with_character= (bunsetsu_array,bunsetsu_num_including_verb) => {
    for(let temp_bunsetsu_num=bunsetsu_num-1;temp_bunsetsu_num>=0;temp_bunsetsu_num--){
        if(/*syugo */) {
            //bunsetsuに主語orobujekutotuika
            bunsetsu_array[bunsetsu_num_including_verb].subject_array.push( bunsetsu_array[temp_bunsetsu_num].subject )
        }else if(/*object*/){
            bunsetsu_array[bunsetsu_num_including_verb].object_array.push( bunsetsu_array[temp_bunsetsu_num].object )
        }
    }
}

//search verb of subject/object

let search_subject_of_verb = (sentence,verb_clause_num) =>{
    //let verb_clause = sentence.bunsetsu_array[verb_clause_num]
  for(let temp_clause_num = verb_clause_num; temp_clause_num>=0; temp_clause_num++){
      let temp_clause=sentence.bunsetsu_array[temp_clause_num]
      if(temp_clause.includesSubject){
          sentence.bunsetsu_array[ verb_clause_num ].subject_of_verb = temp_clause.subject
          break;
      }
  }
}

let search_object_of_verb = (sentence,verb_clause_num) =>{
    for(let temp_clause_num = verb_clause_num; temp_clause_num>=0; temp_clause_num++){
        let temp_clause=sentence.bunsetsu_array[temp_clause_num]
        if(temp_clause.includesObject){
            sentence.bunsetsu_array[ verb_clause_num ].object_of_verb = temp_clause.object
            break;
        }
    }
}

export {search_object_of_verb,search_subject_of_verb}