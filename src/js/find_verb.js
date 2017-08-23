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
        if ( includesVerb(knparray[rowNo])) {
            let temp_character_name=knparray[rowNo][0];
            //上の行も引数にしないといけない
            KNP_verb_array.push(new KNP_verb(rowNo,knparray[rowNo],knparray[rowNo-1]))
        }
    }
}

let includesVerb=(word_row)=>{
    if(word_row[3]=="同士"){
        return true
    }
    return false
}

let find_verb_in_bunsetsu = (bunsetsu) => {
    if(includesVerb(bunsetsu.word_array[0].raw_array)){
        bunsetsu.isVerb=true
        bunsetsu.verb= bunsetsu.word_array[0].basic_form
    }
}

export {find_verb_from_csv,find_verbs,find_verb_in_bunsetsu}