/**
 * Created by uetsujitomoya on 2017/08/21.
 */

import {contains_japanese} from "../js/contains_japanese.js"

const characterKeyword="カテゴリ:人>"

//Aさんを追加→1単語とする

let find_character = (knparray,KNP_character_array) => {
    //if かな exist

    for(const row of knparray){//"さん"判断にindex使いたいからアカンわ。
        if(contains_japanese(row[0])){
            let temp_japanese = row[0]
            for(const element of row){
                if ( element.match(characterKeyword)) {
                    if(isNewCharacter()){
                        createNewCharacter()
                    }
                }
            }
            //さんの場合、1つ前遡って足して、Aさん
            if(row[0]==="さん"){
                if(isNewCharacter()){
                    createNewCharacter()
                }
            }
        }
    }



    knparray.forEach((row)=>{
        //console.log(row)
        if(contains_japanese(row[0])){
            let temp_japanese = row[0]
            for(const element of row){
                if ( element.match(characterKeyword)) {
                    let temp_character_name=row[0];
                    let isNewCharacter = true
                    //被ってなければその登場人物のインスタントをつくる
                    KNP_character_array.forEach((character)=>{
                        if(temp_character_name===character.name){
                            //verbを追加
                            isNewCharacter = false;
                            //太さ加算
                            //character.character_node.bold_qty++
                        }
                    })
                    if(isNewCharacter === true){
                        KNP_character_array.push(new KNP_character(temp_character_name))
                    }
                }
            }
            /*
             row.forEach((element)=>{
             if ( element.match(characterKeyword)) {
             let temp_character_name=row[0];
             let isNewCharacter = true
             //被ってなければその登場人物のインスタントをつくる
             KNP_character_array.forEach((character)=>{
             if(temp_character_name==character.name){
             //verbを追加
             isNewCharacter = false;
             //太さ加算
             //character.character_node.bold_qty++
             }
             })
             if(isNewCharacter==true){
             KNP_character_array.push(new KNP_character(temp_character_name))
             }
             }
             })
             */
            //さんの場合、1つ前遡って足して、Aさん
            if(row[0] === "さん"){
                const tempCharacter = knparray[index-1][0]+row[0]
                if(isNewCharacter(tempCharacter)){
                    createNewCharacter(tempCharacter)
                }
            }
        }
    })
}

let isNewCharacter=(tempCharacterName,characterArray)=> {
    for(const character of characterArray){
        if(tempCharacterName === character.name){
            //verbを追加
            return false;

            //太さ加算
            //character.character_node.bold_qty++
        }
    }
    return true
}

let createNewCharacter=()=>{
    //Nodeを出現させるとしたらどこまでつくるかも書く

}

class character{
    constructor(){
        this.chalacter_name="null"
        this.isClient=false
        this.character_node = new Node(character_name,sentence,this.isClient)

    }
}



class Node{
    constructor(character_name,sentence,isClient){
        //this.character=character
        this.node_r=0
        this.node_x=0
        this.node_y=0
        this.node_text=character_name
        this.bold_qty=1
        if(isClient){
            this.node_color=color_of_client
        }else{
            this.node_color=color_of_people_around_client
        }

    }
}



let add_bold_of_node = () => {

}

export {find_character}



class KNP_character {
    constructor(name) {
        this.name = name
        if(this.name === "私"){
            this.client = 1
        }else{
            this.client = 0
        }
    }
}