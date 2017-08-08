/**
 * Created by uetsujitomoya on 2017/08/08.
 */

let read_KNP = () => {
    find_character();
    find_verb();
    //if verb was found,
    find_dependency();
}

let find_character = () => {
　　//if かな exist
    if(knpcsv[row][0]=="ひらがな"){
        knpcsv[row].foreach((col)=>{
            if(knpcsv[row][col]=="ひと"){
                //その登場人物のインスタントをつくる
            }
        })
    }
}

let find_verb = () => {
  //if 動詞 exist -> find_dependency
}

let find_dependency = () => {
    find_subject();
    find_object();
}

let find_subject = () => {

}

let find_object = () => {

}