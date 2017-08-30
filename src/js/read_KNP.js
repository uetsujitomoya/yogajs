/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from "../csv2Array.js"

import {getCSV} from "../js/getCSV.js"
import {reconstruct_KNP} from "../js/reconstruct_KNP.js"

import {find_character} from "../js/find_character.js"

let KNP_character_array = [];

let KNP_verb_array=[]








let read_KNP = () => {
    let knparray = csv2Array("../csv/1707051018knptab.csv");
    console.log(knparray)
    find_character(knparray,KNP_character_array);
    console.log(KNP_character_array)

    //organize_KNPresult()

    //find_verb(knparray);
    //console.log(KNP_verb_array)
    //if verb was found,
    let KNP_sentence_array = reconstruct_KNP(knparray,KNP_character_array);
    console.log("get out reconstruct_KNP")
    console.log(KNP_sentence_array)


    //find_dependency();
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