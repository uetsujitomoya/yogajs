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