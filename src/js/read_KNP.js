/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from "../csv2Array.js"

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

    //find_verb(knparray);
    //console.log(KNP_verb_array)
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





let find_dependency = () => {
    find_subject();
    find_object();
}

let find_subject = () => {

}

let find_object = () => {

}

export {read_KNP}