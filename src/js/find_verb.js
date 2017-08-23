/**
 * Created by uetsujitomoya on 2017/08/21.
 */

let find_verbs = (knparray) => {
    //if 動詞 exist -> find_dependency

    for( let rowNo = 0 ; rowNo < knparray.length ;rowNo++ ){
        let surface
        find_verb_from_csv(rowNo,knparray)
    }
}

class KNP_verb {
    constructor(rowNo,row_array,upper_row_array) {
        this.rowNo = rowNo;
        this.subject = "null"
        this.object = "null"
        this.kakarareruNo = upper_row_array[1]
        this.surface_form = row_array[0]
        this.basic_form = row_array[2]
    }
}

let find_verb_from_csv =(rowNo, knparray)=>{
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

let includesVerb=(text)=>{
    if(text)
}

export {find_verb_from_csv,find_verbs}