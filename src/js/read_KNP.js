/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from "../csv2Array.js"
import {contains_japanese} from "../js/contains_japanese.js"
import {getCSV} from "../js/getCSV.js"
import {reconstruct_KNP} from "../js/reconstruct_KNP.js"

let KNP_character_array = [];

let KNP_verb_array=[]



class KNP_character {
    constructor(name) {
        this.name = name
        if(this.name=="私"){
            this.client = 1
        }else{
            this.client = 0
        }
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


let read_KNP = () => {
    let knparray = csv2Array("../csv/1707051018knptab.csv");
    console.log(knparray)
    find_character(knparray);
    console.log(KNP_character_array)

    //organize_KNPresult()

    find_verb(knparray);
    console.log(KNP_verb_array)
    //if verb was found,
    let KNP_sentence_array = reconstruct_KNP(knparray);
    console.log(KNP_sentence_array)


    find_dependency();
}
/*
let reconstruct_KNP = (raw_2d_array) => {
    raw_2d_array.forEach((row_array)=>{
        if(row_array[0]=="#"){

        }
    })
}
*/

let find_character = (knparray) => {
    //if かな exist
    knparray.forEach((row)=>{
        //console.log(row)
        if(contains_japanese(row[0])){
            let temp_japanese = row[0]
            row.forEach((element)=>{
                if ( element.match("カテゴリ:人")) {
                    let temp_character_name=row[0];
                    let isNewCharacter = true
                    //被ってなければその登場人物のインスタントをつくる
                    KNP_character_array.forEach((character)=>{
                        if(temp_character_name==character.name){
                            //verbを追加
                            isNewCharacter = false;
                        }
                    })
                    if(isNewCharacter==true){
                        KNP_character_array.push(new KNP_character(temp_character_name))
                    }
                }
            })
        }
    })
}

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

let find_dependency = () => {
    find_subject();
    find_object();
}

let find_subject = () => {

}

let find_object = () => {

}

export {read_KNP}