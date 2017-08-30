/**
 * Created by uetsujitomoya on 2017/08/17.
 */

import　{includesVerb} from "../js/find_verb.js"
import verbInSentence from "../js/create_verbInSentence_class.js"
import {createsvg} from "../js/arrow_node.js"

let first_japanese_row_num_in_sentence = 3 ;
let first_japanese_row_num_in_bunsetsu = 2 ;
let starting_kihonku_row_num_in_sentence = 2 ;
let starting_bunsetsu_row_num_in_sentence = 1 ;

let reconstruct_KNP = (raw_2d_array,KNP_character_array) => {
    let KNP_sentence_array=[]
    let temp_sentence_2d_array=[]
    let temp_rowNo=0;
    raw_2d_array.forEach((row_array)=>{
        if(row_array[0]!="EOS"){
            temp_sentence_2d_array.push(row_array)
        }else{
            KNP_sentence_array.push(new KNP_Sentence(temp_rowNo,temp_sentence_2d_array,KNP_character_array))
            temp_sentence_2d_array=[]
        }
        temp_rowNo++
    })
    console.log("to enter createsvg")
    createsvg()
    return KNP_sentence_array
}

let count_bunsetsu=(input_2d_array)=>{
    let cnt=0
    input_2d_array.forEach((row_array)=>{
        if(row_array[0]=="*"){
            cnt++
        }
    })
    return cnt
}

let count_kihonku=(input_2d_array)=>{
    let cnt=0
    input_2d_array.forEach((row_array)=>{
        if(row_array[0]=="+"){
            cnt++
        }
    })
    return cnt
}

//文節取得
/*EODまでが一個の文
 アスタリスクが1個の文節 phtase_no
 プラスが1個の基本句　basic_phrase_no
 *2次元配列を4次元配列に組み替える
 * */

class KNP_Sentence{
    constructor(raw_rowNo,sentence_2d_array,KNP_character_array) {
        //console.log("raw_rowNo %d",raw_rowNo)
        //console.log(sentence_2d_array)
        if(sentence_2d_array.length==1){
            return 0
        }//空白センテンス処理

        //動詞判定・登場人物判定と組み合わせる

        //PARAがかかる先は？

        //PARAの探索（3列目にPを含む文字列があればPARAがそこにあると判定し、文節配列と基本句配列にPARAを挿入）
        //そのためには、始めに文節配列・基本句配列のlengthだけ決めてしまったほうが良い

        this.verb_array=[]

        //this.csv_raw_array=[]
        this.rowNo=raw_rowNo
        this.bunsetsu_array=[]
        this.bunsetsu_array.length=count_bunsetsu(sentence_2d_array)

        this.kihonku_array=[]
        this.kihonku_array.length=count_kihonku(sentence_2d_array)

        this.surface_form = "null"
        //this.basic_form = row_array[2]

        let temp_2d_array_for_bunsetsu=[]
        let temp_2d_array_for_kihonku=[]

        temp_2d_array_for_bunsetsu.push(sentence_2d_array[starting_bunsetsu_row_num_in_sentence])//0文節目　開始宣言をプッシュ

        temp_2d_array_for_bunsetsu.push(sentence_2d_array[starting_kihonku_row_num_in_sentence])//0基本句目　開始宣言をプッシュ
        temp_2d_array_for_kihonku.push(sentence_2d_array[starting_kihonku_row_num_in_sentence])//0基本句目　開始宣言をプッシュ

        let bunsetsu_num_in_sentence=0
        let kihonku_num_in_sentence=0



        for( let temp_rowNo = first_japanese_row_num_in_sentence ; temp_rowNo < sentence_2d_array.length ; temp_rowNo++ ){
            let temp_surface_form=sentence_2d_array[temp_rowNo][0];
            if(temp_surface_form=="+" && sentence_2d_array[temp_rowNo-1][0]!="*"){//文節内 2こ目以降の基本句
                //console.info(temp_2d_array_for_kihonku)
                this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence,temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
                temp_2d_array_for_kihonku=[]
                kihonku_num_in_sentence++
            }else if( temp_surface_form == "*" ){
                //console.info(temp_2d_array_for_kihonku)
                this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence,temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
                temp_2d_array_for_kihonku=[]
                kihonku_num_in_sentence++

                //console.info(temp_2d_array_for_bunsetsu)
                this.bunsetsu_array[bunsetsu_num_in_sentence] = new KNP_Bunsetsu(bunsetsu_num_in_sentence,temp_2d_array_for_bunsetsu,KNP_character_array)//文の中の通し番号での文節array

                //verb_array作成
                if(this.bunsetsu_array[bunsetsu_num_in_sentence].isVerb){
                    this.verb_array.push(new verbInSentence(bunsetsu_num_in_sentence,temp_2d_array_for_bunsetsu))
                }

                temp_2d_array_for_bunsetsu=[]
                bunsetsu_num_in_sentence++
            }
            temp_2d_array_for_bunsetsu.push(sentence_2d_array[temp_rowNo])
            temp_2d_array_for_kihonku.push(sentence_2d_array[temp_rowNo])
        }

        //console.log("bunsetsu_num_in_sentence %d",bunsetsu_num_in_sentence)
        //console.log(temp_2d_array_for_bunsetsu)
        this.bunsetsu_array[bunsetsu_num_in_sentence] = new KNP_Bunsetsu(bunsetsu_num_in_sentence,temp_2d_array_for_bunsetsu,KNP_character_array)

        //verb_array作成
        if(this.bunsetsu_array[bunsetsu_num_in_sentence].isVerb){
            this.verb_array.push(new verbInSentence(bunsetsu_num_in_sentence,temp_2d_array_for_bunsetsu))
        }

        this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence,temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
        /*
         raw_2d_array.forEach((row_array)=>{

         })
         */

        //最後に、掛かり先を探索して埋める
        this.input_each_kakarareru_bunsetsu_id();
        this.input_each_kakarareru_kihonku_id();


        console.log("this.verb_array")
        console.log(this.verb_array)

        let tempVerbNum=0
        this.verb_array.forEach((verb)=>{
            this.search_subject_of_verb(verb.bunsetsuNum_inSentence,tempVerbNum)
            this.search_object_of_verb(verb.bunsetsuNum_inSentence,tempVerbNum)
            tempVerbNum++
        })

        console.log("EOS,row id = %d",raw_rowNo)
        console.log(this)

    }

    input_each_kakarareru_bunsetsu_id () {
        //動詞なら、その動詞にかかるのを探していく
        this.bunsetsu_array.forEach((kakaru_bunsetsu)=>{
            for(let kakarareru_bunsetsu_num = 0 ; kakarareru_bunsetsu_num < this.bunsetsu_array.length ; kakarareru_bunsetsu_num++){

                //console.log(this.bunsetsu_array[kakarareru_bunsetsu_num])
                if(kakaru_bunsetsu.kakaru_bunsetsu_id == this.bunsetsu_array[kakarareru_bunsetsu_num].id){
                    this.bunsetsu_array[kakarareru_bunsetsu_num].kakarareru_bunsetsu_id_array.push(kakaru_bunsetsu.id)
                    //console.log(this.bunsetsu_array[kakarareru_bunsetsu_num])
                    break;
                }
            }
        })
    }

    input_each_kakarareru_kihonku_id(){
        this.kihonku_array.forEach((kakaru_kihonku)=>{
            //console.log(this.kihonku_array)
            for(let kakarareru_kihonku_num = 0 ; kakarareru_kihonku_num < this.kihonku_array.length ; kakarareru_kihonku_num++){
                //console.log(this.kihonku_array[kakarareru_kihonku_num])
                if(kakaru_kihonku.kakatu_kihonku_id == this.kihonku_array[kakarareru_kihonku_num].id){
                    this.kihonku_array[kakarareru_kihonku_num].kakarareru_kihonku_id_array.push(kakaru_kihonku.id)
                    //console.log(this.kihonku_array[kakarareru_kihonku_num])
                    break;
                }
            }
        })
    }

    search_subject_of_verb (verb_clause_num,tempVerbNum) {
        //let verb_clause = sentence.bunsetsu_array[verb_clause_num]
        for(let temp_clause_num = verb_clause_num; temp_clause_num>=0; temp_clause_num--){
            let temp_clause=this.bunsetsu_array[temp_clause_num]
            console.log(temp_clause)
            if(temp_clause.isSubject){
                this.bunsetsu_array[ verb_clause_num ].subject_of_verb = temp_clause.subject
                //alert(this.bunsetsu_array[ verb_clause_num ].subject_of_verb)
                this.verb_array[tempVerbNum].subject=temp_clause.subject
                break;
            }
        }
    }

    search_object_of_verb (verb_clause_num,tempVerbNum) {
        for(let temp_clause_num = verb_clause_num; temp_clause_num>=0; temp_clause_num--){
            let temp_clause=this.bunsetsu_array[temp_clause_num]
            if(temp_clause.isObject){
                this.bunsetsu_array[ verb_clause_num ].object_of_verb = temp_clause.object
                //alert(this.bunsetsu_array[ verb_clause_num ].object_of_verb)
                this.verb_array[tempVerbNum].object=temp_clause.object
                break;
            }
        }
    }
}

class KNP_Bunsetsu {
    constructor(num,input_2d_array,KNP_character_array) {
        console.log(KNP_character_array)
        //console.log(input_2d_array)

        this.csv_raw_array=input_2d_array
        //this.rowNo=rowNo
        this.id = num+"D"

        this.kihonku_array=[]
        this.kihonku_array.length=count_kihonku(input_2d_array)

        this.word_array=[]

        /*
         if(this.word_array[0][3]=="動詞"){
         this.verb_data={}
         }
         */
        this.kakaru_bunsetsu_id = input_2d_array[0][1]
        this.kakarareru_bunsetsu_id_array = []
        this.surface_form = ""
        input_2d_array.forEach((row_array)=>{
            this.surface_form += row_array[0]
            this.word_array.push( new KNP_word(row_array) )
        })

        //this.existsSubject=false
        //this.existsObject=false
        this.isVerb=false

        this.make_kihonku_array_in_bunsetsu( input_2d_array )

        //characterか否か。違うならverbへ
        //characterならobjectかsubjectか

        let temp_character_name=this.csv_raw_array[first_japanese_row_num_in_bunsetsu][0]

        console.log(temp_character_name)

        if(isCharacter(KNP_character_array,temp_character_name)){
            console.log("%s is character",temp_character_name)
            const bunsetsu_info_row = this.csv_raw_array[0]

            //colごとになめる
            for(let col_num=0;col_num<bunsetsu_info_row.length;col_num++){
                if (( bunsetsu_info_row[col_num].match("ヲ格") || bunsetsu_info_row[col_num].match("ニ格"))) {
                    console.log("%s is object",this.surface_form)
                    this.add_about_object(KNP_character_array)
                    break;
                } else if (bunsetsu_info_row[col_num].match("ガ格")) {
                    console.log("%s is subject",this.surface_form)
                    this.add_about_subject()
                    break;
                }
            }
        }else{
            this.find_verb_in_bunsetsu()
        }
        console.log(this)
    }

    make_kihonku_array_in_bunsetsu( bunsetsu_raw_2d_array ){
        let kihonku_num_in_bunsetsu = 0
        let temp_2d_array_for_kihonku=[]
        if(bunsetsu_raw_2d_array.length>=1){
            //console.log("bunsetsu_raw_2d_array")
            //console.log(bunsetsu_raw_2d_array)
            let japanese_starting_num = 2
            for( let temp_rowNo = japanese_starting_num ; temp_rowNo < bunsetsu_raw_2d_array.length ; temp_rowNo++ ){
                let temp_row=bunsetsu_raw_2d_array[temp_rowNo]
                if(temp_row[0]=="+"){//文節内 2こ目以降の基本句
                    //console.info(temp_2d_array_for_kihonku)
                    this.kihonku_array[kihonku_num_in_bunsetsu] = new KNP_kihonku_in_bunsetsu(temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
                    temp_2d_array_for_kihonku=[]
                    kihonku_num_in_bunsetsu++
                }
                temp_2d_array_for_kihonku.push(temp_row)
            }
            this.kihonku_array[kihonku_num_in_bunsetsu] = new KNP_kihonku_in_bunsetsu(temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
        }
    }

    add_about_object(KNP_character_array){

        this.isObject=true
        this.object=this.surface_form
        //alert(this.object)
        //console.log("%s is object",temp_character_name)

    }

    add_about_subject(KNP_character_array){
        this.isSubject=true
        this.subject=this.surface_form
        //alert(this.subject)
        //console.log("%s is subject",temp_character_name)

    }

    find_verb_in_bunsetsu () {
        //console.log("entered find_verb_in_bunsetsu")
        //let first_japanise_row_num =2
        //console.log(this.word_array[first_japanise_row_num].raw_array)

        if(includesVerb(this.word_array[first_japanese_row_num_in_bunsetsu].raw_array)){
            this.isVerb=true
            this.verb= this.word_array[first_japanese_row_num_in_bunsetsu].basic_form
            //console.log("this.verb")
            //console.log(this.verb)
        }
    }
}


class KNP_kihonku_in_sentence {
    constructor(num,input_2d_array) {
        //console.log(input_2d_array)

        this.csv_raw_array=input_2d_array
        //this.rowNo=rowNo
        this.id = num+"D"

        this.word_array=[]
        for(let rowNo =1;rowNo<input_2d_array.length;rowNo++){
            this.word_array.push(new KNP_word(input_2d_array[rowNo]))
        }
        //console.log("word_array_in_kihonku %s",this.id)
        //console.log(this.word_array)
        /*
         if(this.word_array[0][3]=="動詞"){
         this.verb_data={}
         }
         */
        this.kakaru_kihonku_id = input_2d_array[0][1]
        this.kakarareru_kihonku_id_array = []
        this.surface_form = ""
        input_2d_array.forEach((row_array)=>{
            this.surface_form += row_array[0]
        })
    }
}

class KNP_kihonku_in_bunsetsu {
    constructor(row_array) {

        //console.log("row_array")
        //console.log(row_array)

        this.csv_raw_array=[]
        //this.rowNo=rowNo
        //this.num = num+"D"
        this.word_array=[]
        for(let rowNo =1;rowNo<row_array.length;rowNo++){

        }
        /*
         if(row_array[1][3]=="動詞"){
         this.verb_data={}
         }*/

        this.subject = "null"
        this.object = "null"
        //this.kakarareruNo = upper_row_array[1]
        this.kakaruNo = "null"
        this.surface_form = row_array[0]
    }
}

class KNP_word {
    constructor(row_array) {
        this.raw_array=row_array

        this.csv_raw_array=[]
        //this.rowNo=rowNo
        this.hinshi=row_array[3]

    }
}

let existsSubject=(bunsetsu,KNP_character_array)=>{
    const bunsetsu_info_row = bunsetsu.csv_raw_array[0]
    const temp_character_name=bunsetsu.csv_raw_array[1][0]
    for(var col_num=0;col_num<bunsetsu_info_row.length;col_num++){
        if ( bunsetsu_info_row[col_num].match("ガ格")&&isCharacter(KNP_character_array,temp_character_name)) {
            bunsetsu.isSubject=true
            bunsetsu.subject=temp_character_name
            //alert(bunsetsu.subject)
            break;
        }
    }
}

let existsObject=(bunsetsu,KNP_character_array)=>{
    const bunsetsu_info_row = bunsetsu.csv_raw_array[0]
    const temp_character_name=bunsetsu.csv_raw_array[1][0]
    for(let col_num=0;col_num<bunsetsu_info_row.length;col_num++){
        if ( ( bunsetsu_info_row[col_num].match("ヲ格") || bunsetsu_info_row[col_num].match("ニ格") ) && isCharacter(KNP_character_array,temp_character_name) ) {
            bunsetsu.isObject=true
            bunsetsu.object=temp_character_name
            //alert(bunsetsu.object)
            break;
        }
    }
}

let isCharacter=(KNP_character_array,temp_character_name)=>{
    console.log(temp_character_name)
    for(let chara_num=0;chara_num < KNP_character_array.length;chara_num++){
        if(temp_character_name==KNP_character_array[chara_num].name){
            console.log("icchi")
            return true
        }
    }
    return false
}

export {reconstruct_KNP}