/**
 * Created by uetsujitomoya on 2017/08/08.
 */

import {csv2Array} from "../csv2Array.js"
import {contains_japanese} from "../js/contains_japanese.js"
import {getCSV} from "../js/getCSV.js"

let KNP_character_array = [];

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

let read_KNP = () => {
    let knparray = csv2Array("../csv/1707051018knptab.csv");
    console.log(knparray)
    find_character(knparray);
    console.log(KNP_character_array)

    organize_KNPresult()

    find_verb();
    //if verb was found,
    find_dependency();
}

let find_character = (knparray) => {
    //if かな exist
    knparray.forEach((row)=>{
        console.log(row)
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

export {read_KNP}