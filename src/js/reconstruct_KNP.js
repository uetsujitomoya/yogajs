/**
 * Created by uetsujitomoya on 2017/08/17.
 */

let first_japanese_row_num_in_sentence = 3 ;
let starting_kihonku_row_num_in_sentence = 2 ;
let starting_bunsetsu_row_num_in_sentence = 1 ;

let reconstruct_KNP = (raw_2d_array) => {
    let KNP_sentence_array=[]
    let temp_sentence_2d_array=[]
    let temp_rowNo=0;
    raw_2d_array.forEach((row_array)=>{
        if(row_array[0]!="EOS"){
            temp_sentence_2d_array.push(row_array)
        }else{
            KNP_sentence_array.push(new KNP_sentence(temp_rowNo,temp_sentence_2d_array))
            temp_sentence_2d_array=[]
        }
        temp_rowNo++
    })
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

class KNP_sentence{
    constructor(raw_rowNo,sentence_2d_array) {
        console.log("raw_rowNo %d",raw_rowNo)
        console.log(sentence_2d_array)
        if(sentence_2d_array.length==1){
            return 0
        }//空白センテンス処理

        //動詞判定・登場人物判定と組み合わせる

        //PARAがかかる先は？

        //PARAの探索（3列目にPを含む文字列があればPARAがそこにあると判定し、文節配列と基本句配列にPARAを挿入）
        //そのためには、始めに文節配列・基本句配列のlengthだけ決めてしまったほうが良い

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
                console.info(temp_2d_array_for_kihonku)
                this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence,temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
                temp_2d_array_for_kihonku=[]
                kihonku_num_in_sentence++
            }else if( temp_surface_form == "*" ){
                console.info(temp_2d_array_for_kihonku)
                this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence,temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
                temp_2d_array_for_kihonku=[]
                kihonku_num_in_sentence++

                console.info(temp_2d_array_for_bunsetsu)
                this.bunsetsu_array[bunsetsu_num_in_sentence] = new KNP_bunsetsu(bunsetsu_num_in_sentence,temp_2d_array_for_bunsetsu)//文の中の通し番号での文節array
                temp_2d_array_for_bunsetsu=[]
                bunsetsu_num_in_sentence++
            }
            temp_2d_array_for_bunsetsu.push(sentence_2d_array[temp_rowNo])
            temp_2d_array_for_kihonku.push(sentence_2d_array[temp_rowNo])
        }

        console.log("bunsetsu_num_in_sentence %d",bunsetsu_num_in_sentence)
        console.log(temp_2d_array_for_bunsetsu)
        this.bunsetsu_array[bunsetsu_num_in_sentence] = new KNP_bunsetsu(bunsetsu_num_in_sentence,temp_2d_array_for_bunsetsu)
        this.kihonku_array[kihonku_num_in_sentence] = new KNP_kihonku_in_sentence(kihonku_num_in_sentence,temp_2d_array_for_kihonku)//文の中の通し番号での基本句array
        /*
        raw_2d_array.forEach((row_array)=>{
            
        })
        */

        //最後に、掛かり先を探索して埋める
        this.input_each_kakarareru_bunsetsu_id();
        this.input_each_kakarareru_kihonku_id();
    }

    input_each_kakarareru_bunsetsu_id () {
        //動詞なら、その動詞にかかるのを探していく
        this.bunsetsu_array.forEach((kakaru_bunsetsu)=>{
            for(let kakarareru_bunsetsu_num = 0 ; kakarareru_bunsetsu_num < this.bunsetsu_array.length ; kakarareru_bunsetsu_num++){

                console.log(this.bunsetsu_array[kakarareru_bunsetsu_num])
                if(kakaru_bunsetsu.kakaru_bunsetsu_id == this.bunsetsu_array[kakarareru_bunsetsu_num].id){
                    this.bunsetsu_array[kakarareru_bunsetsu_num].kakarareru_bunsetsu_id_array.push(kakaru_bunsetsu.id)
                    console.log(this.bunsetsu_array[kakarareru_bunsetsu_num])
                    break;
                }
            }
        })
    }

    input_each_kakarareru_kihonku_id(){
        this.kihonku_array.forEach((kakaru_kihonku)=>{
            console.log(this.kihonku_array)
            for(let kakarareru_kihonku_num = 0 ; kakarareru_kihonku_num < this.kihonku_array.length ; kakarareru_kihonku_num++){
                console.log(this.kihonku_array[kakarareru_kihonku_num])
                if(kakaru_kihonku.kakatu_kihonku_id == this.kihonku_array[kakarareru_kihonku_num].id){
                    this.kihonku_array[kakarareru_kihonku_num].kakarareru_kihonku_id_array.push(kakaru_kihonku.id)
                    console.log(this.kihonku_array[kakarareru_kihonku_num])
                    break;
                }
            }
        })
    }
}

class KNP_bunsetsu {
    constructor(num,input_2d_array) {
        //console.log(input_2d_array)

        this.csv_raw_array=input_2d_array
        //this.rowNo=rowNo
        this.id = num+"D"
        this.kihonku_array=[]
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
        })
    }
}

class KNP_kihonku_in_sentence {
    constructor(num,input_2d_array) {
        console.log(input_2d_array)

        this.csv_raw_array=input_2d_array
        //this.rowNo=rowNo
        this.id = num+"D"
        this.word_array=[]
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

class KNP_kihonku_in_clause {
    constructor(rowNo,row_array,upper_row_array) {

        this.csv_raw_array=[]
        this.rowNo=rowNo
        this.num = num+"D"
        this.word_array=[]
        if(this.word_array[0][3]=="動詞"){
            this.verb_data={}
        }

        this.subject = "null"
        this.object = "null"
        this.kakarareruNo = upper_row_array[1]
        this.kakaruNo = "null"
        this.surface_form = row_array[0]
    }
}



class KNP_word {
    constructor(rowNo,row_array,upper_row_array) {

        this.csv_raw_array=[]
        this.rowNo=rowNo
        this.hinshi=row_array[3]

    }
}

export {reconstruct_KNP}