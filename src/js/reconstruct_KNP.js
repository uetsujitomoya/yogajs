/**
 * Created by uetsujitomoya on 2017/08/17.
 */

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

//文節取得
/*EODまでが一個の文
 アスタリスクが1個の文節 phtase_no
 プラスが1個の基本句　basic_phrase_no
 *2次元配列を4次元配列に組み替える
 * */

class KNP_sentence{
    constructor(raw_rowNo,raw_2d_array) {

        //PARAの探索（3列目にPを含む文字列があればPARAがそこにあると判定し、文節配列と基本句配列にPARAを挿入）
        //そのためには、始めに文節配列・基本句配列のlengthだけ決めてしまったほうが良い

        //this.csv_raw_array=[]
        this.rowNo=raw_rowNo
        this.bunsetsu_array=[]
        this.kihonku_array=[]
        this.surface_form = "null"
        //this.basic_form = row_array[2]

        let temp_2d_array_for_bunsetsu=[]
        let temp_2d_array_for_kihonku=[]

        temp_2d_array_for_bunsetsu.push(raw_2d_array[1])//0文節目　開始宣言をプッシュ

        temp_2d_array_for_bunsetsu.push(raw_2d_array[2])//0基本句目　開始宣言をプッシュ
        temp_2d_array_for_kihonku.push(raw_2d_array[2])//0基本句目　開始宣言をプッシュ

        let clause_No_in_sentence=0
        let kihonku_No_in_sentence=0

        for(let temp_rowNo=2;temp_rowNo<raw_2d_array.length;temp_rowNo++){
            let temp_surface_form=raw_2d_array[temp_rowNo][0];
            if(temp_surface_form=="+" && raw_2d_array[temp_rowNo-1][0]!="*"){//文節内 2こ目以降の基本句
                this.kihonku_array.push(new KNP_kihonku_in_sentence(temp_2d_array_for_kihonku))//文の中の通し番号での基本句array
                temp_2d_array_for_kihonku=[]
                kihonku_No_in_sentence++
            }else if( temp_surface_form == "*" ){
                this.kihonku_array.push(new KNP_kihonku_in_sentence(temp_2d_array_for_kihonku))//文の中の通し番号での基本句array
                temp_2d_array_for_kihonku=[]
                kihonku_No_in_sentence=0

                this.bunsetsu_array.push(new KNP_bunsetsu(temp_2d_array_for_bunsetsu))//文の中の通し番号での基本句array
                temp_2d_array_for_bunsetsu=[]
                clause_No_in_sentence++
            }
            temp_2d_array_for_bunsetsu.push(raw_2d_array[temp_rowNo])
            temp_2d_array_for_kihonku.push(raw_2d_array[temp_rowNo])
        }

        this.bunsetsu_array.push(new KNP_bunsetsu())
        this.kihonku_array.push(new KNP_kihonku_in_sentence())//文の中の通し番号での基本句array
        /*
        raw_2d_array.forEach((row_array)=>{
            
        })
        */

        //最後に、掛かり先を探索して埋める
        this.input_each_kakarareru_id();
    }

    input_each_kakarareru_id () {
        //動詞なら、その動詞にかかるのを探していく

    }
}

class KNP_bunsetsu {
    constructor(num,input_2d_array) {

        this.csv_raw_array=input_2d_array
        this.rowNo=rowNo
        this.id = num+"D"
        this.kihonku_array=[]
        this.word_array=[]
        if(this.word_array[0][3]=="動詞"){
            this.verb_data={}
        }
        this.kakaru_bunsetsu_id = input_2d_array[0][1]
        this.kakarareru_bunsetsu_id = "null"
        this.surface_form = row_array[0]
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

class KNP_kihonku_in_sentence {
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