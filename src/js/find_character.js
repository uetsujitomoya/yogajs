/**
 * Created by uetsujitomoya on 2017/08/21.
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

class character{
    constructor(){
        this.name="null"
        this.isClient=false
    }
}