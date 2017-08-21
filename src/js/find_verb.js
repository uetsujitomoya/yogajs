/**
 * Created by uetsujitomoya on 2017/08/21.
 */

let find_verb = (knparray) => {
    //if 動詞 exist -> find_dependency

    for( let rowNo = 0 ; rowNo < knparray.length ;rowNo++ ){
        if(contains_japanese(knparray[rowNo][0])){
            let temp_japanese = knparray[rowNo][0]
            console.log(knparray[rowNo][3])
            if ( knparray[rowNo][3]=="動詞") {
                let temp_character_name=knparray[rowNo][0];
                //上の行も引数にしないといけない
                KNP_verb_array.push(new KNP_verb(rowNo,knparray[rowNo],knparray[rowNo-1]))
            }
        }
    }
}