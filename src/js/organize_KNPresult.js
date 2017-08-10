/**
 * Created by uetsujitomoya on 2017/08/09.
 */

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

//いつものやつで話者分類まではつくっとくべき。
//てかKNP-人間関係図といつもの分類-いつもの可視化はバッサリ区別していいんじゃね

let kuromoji_word

let Kuromoji_sentence

let Kuromoji_hatsugen

let Kuromoji_full_text


//単語のみ抜き出して処理
class KNP_word{
    constructor(row){
        this.basic_form=row[1];
        this.surface_form:row[0];
    }

    //pathのプロパティに「questionCategory」「AnswerCategory」「hinshi」などを追加すればいい気はする。
    //てかkuromoji.js使わないんだった。。KNPからうまく取得せよ
}

//subjectかobjectに登場人物が入ってるverbを抽出せよ。

//「*」から「*」までが1つの「文節」（「*」B列のかかり先表示はよくわからないので無視していい。……ことはない。ヴィジュアライズなKNPパイプ表現と非対応だが、より自然。次に係る基本句ではなく、次に係る文節単位で考えられている。「教育費を」）

class KNP_clause{
    constructor(){
        this.verb=null;
        this.object=null;
        this.subject=null
    }
}

//↑記号を頼りにつくる

/*
 * 1. 動詞（用言：動　など）にかかる文節を統合して1clauseと定義。
 行内のどれかの(ループ？)
 　　　　　　　要素に「用言」を含むか　の判定
 * */

//EOSで1文と定義

let KNPsentence = {
    text:null,
    answerCategory:null,
    clauseArray:[],
    wordArray:[]
}

//話者交代は「話者。」を放り込んで交代させよう（無理やり）
let KNPhatsugen = {
    text:null,
    talker:null,
    quesrtionCategory:null,
    sentenceArray:[]
}

let KNPparsedAllText = {
    text:orijinalText,
    hatsugenArray : []
}