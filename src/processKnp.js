
//import {TransposeMatrix} from "./index.js";





let processKnp = (name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,newLoveDictionary,newWorkDictionary,newFriendDictionary,RGB) =>{

    let knpArray = csv2Array('text0knptabUtf8.csv');

    console.log("knpArray");
    console.log(knpArray);

    //console.log("Enter processKNP");

    //読み込ませる←4行目で既に読み込ませてる
    //AcceptKnp(knpCsv);

    //基本句の定義
    OrganizeKNP(knpArray,hatsugen,newLoveDictionary,newWorkDictionary,newFriendDictionary,RGB);

    console.log(hatsugen);
/*
    //基本句の最初の単語をタスク判定
    kihonku.forEach((i)=>{
        ClassifyTaskOfKihonku(kihonku,i);
    });
    //そのタスクを基本句のタスクとする
*/
    //その基本句がかかるタスクに愛交友仕事のどれかが入ってる
    //基本句の最初の単語をタスク判定
    knpArray.forEach((i)=>{
        ClassifyTaskOfSentence(knpArray);
    });

    //上側を優先して、その文のタスクを確定
    /*

    var sResult = select(jsonFileName,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

    checkboxlist = sResult.checkboxlist;
    chboxlist = sResult.chboxlist;
    chboxlist2 = sResult.chboxlist2;
    RGB = sResult.RGB;
    RGBlist = sResult.RGBlist;

    checked = sResult.checked;
    checked2 = sResult.checked2;
    taiou = sResult.taiou;
    taiou2 = sResult.taiou2;
    chboxlength = sResult.chboxlength;
    chboxlength2 = sResult.chboxlength2;
    //graph = sResult.graph;
    //console.log("chboxlength2=%d",chboxlength2)


    var vResult = setForViz(jsonFileName,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);//形態素解析後に1度目の描画

    */
};

let AcceptKnp = (name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) =>{

    let file = document.getElementById('file-input').files[0];
    name = file.name;
    let reader = new FileReader();
    reader.onload = function(event) {
        let result = ReadKnp();
    };
    reader.readAsText(file);
};

let ReadKnp = (c) =>{

    //dictionaryが入ったことを認識→ストレージも変える

    //csvを辞書に変換
    music = $.csv.toArrays(csv);

    //knp

    //1.辞書の条件を配列かobjectとして定義しておく
    //2.それをcsvの内容に入れ替える
    //3.点数も表にする。

    //ヒットしたら点数加えてブレイク

    //最後にその文がどの分類か判定

    //ストレージ名をわかりやすくし、分類ラベル名を文字列に変える

    //dictionaryが入ったことを認識→ストレージも変える

    let test4;

    test4=1;

};

let DefineHatsugen=(hatsugen,hatsugenNumber)=>{
    hatsugen[hatsugenNumber]={
        sentences:[],
        group:null
    };
};
let DefineSentence=(hatsugen,hatsugenNumber,sentenceNumberInHatsugen)=>{
    hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen]={
        kihonku:[],
        task:null,
        ClassifyTaskOfSentence:(hatsugenNumber,sentenceNumberInHatsugen,newLoveDictionary,newWorkDictionary,newFriendDictionary)=>{
            //最後にその文がどの分類か判定
            /*
             if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
             RGB[hatsugenNumber][sentenceNumberInHatsugen][0]+=newLoveDictionary[1][newLoveDictionary[0].indexOf(wordLookedNow)];
             //wordLookedNowがある行の1列目の値（類似度）を足す
             return "love";
             }else if(newWorkDictionary[0].indexOf(wordLookedNow)!=-1){
             RGB[hatsugenNumber][sentenceNumberInHatsugen][2]+=newWorkDictionary[1][newWorkDictionary[0].indexOf(wordLookedNow)];
             //wordLookedNowがある行の1列目の値（類似度）を足す
             return "work";
             }else if(newFriendDictionary[0].indexOf(wordLookedNow)!=-1){
             RGB[hatsugenNumber][sentenceNumberInHatsugen][1]+=newFriendDictionary[1][newFriendDictionary[0].indexOf(wordLookedNow)];
             //wordLookedNowがある行の1列目の値（類似度）を足す
             return "friend"
             }
             */

            //係り受けされていれば取得
            //なければ最初に分類された単語の分類にしちゃう

            //係り受け判定
            //その句が何かに判定されて
            //かつ、それにかかってくる句も何かに判定されていれば
            //↓
            //前の句の判定を採用し、文の前に置く
            for(let kihonkuNumber=0;kihonkuNumber<this.kihonku.length;kihonkuNumber++){

                if(this.kihonku[kihonkuNumber].task!=null&&this.kihonku[kihonkuNumber].kakattekuruKuNumber!=null){
                    if(this.kihonku[this.kihonku[kihonkuNumber].kakattekuruKuNumber].task!=null){
                        this.task=this.kihonku[kihonkuNumber].task;
                        break;
                    }
                }

            }

            if(RGB[hatsugenNumber][sentenceNumberInHatsugen][0] >= RGB[hatsugenNumber][sentenceNumberInHatsugen][1]){
                RGB[hatsugenNumber][sentenceNumberInHatsugen][1] =0;
                if( RGB[hatsugenNumber][sentenceNumberInHatsugen][0] >= RGB[hatsugenNumber][sentenceNumberInHatsugen][2] ){
                    RGB[hatsugenNumber][sentenceNumberInHatsugen][2] =0;
                }else{
                    RGB[hatsugenNumber][sentenceNumberInHatsugen][0] =0;
                }
            }else{
                RGB[hatsugenNumber][sentenceNumberInHatsugen][0] =0;
                if( RGB[hatsugenNumber][sentenceNumberInHatsugen][1] >= RGB[hatsugenNumber][sentenceNumberInHatsugen][2] ){
                    RGB[hatsugenNumber][sentenceNumberInHatsugen][2] =0;
                }else{
                    RGB[hatsugenNumber][sentenceNumberInHatsugen][1] =0;
                }
            }
        }
    }
};
let DefineKihonku=(hatsugen,hatsugenNumber,sentenceNumberInHatsugen,kihonkuNumber)=>{
    hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber]={
        words:[],
        kakattekuruKuNumber:null,
        kakariniikuKuNumber:null,
        task:null
    };
};


let OrganizeKNP = (knpCsv,hatsugen,newLoveDictionary,newWorkDictionary,newFriendDictionary,RGB) => {
    //基本句オブジェクト作成
    /*
    knpCsv.forEach((row)=>{
        //かかってくる句の愛交友仕事が指定されていれば、その文の分類をやめる
    });
    */
    //orijinalの配列をつくるkeitaisokaiseki[]
    //次の＋までを取得して単語とする

    /*0列目が日本語なら
    * 1.日本語じゃなく鳴るまで取得
    *
    * kihonku生成
    *
    * 2.wordsに詰め込む
    *
    * 3.タスクを知る
    * */

    let kihonkuNumber=0;
    let sentenceNumberInHatsugen=0;
    let hatsugenNumber=0;

    DefineHatsugen(hatsugen,0);
    DefineSentence(hatsugen,0,0);

    //console.log(newLoveDictionary);
    //console.log(newWorkDictionary);
    //console.log(newFriendDictionary);

    console.log(knpCsv.length);

    for(let KNP_csvRow=0;KNP_csvRow<knpCsv.length;KNP_csvRow++)
    {
        console.log(KNP_csvRow);
        if(knpCsv[KNP_csvRow][0]=="："){
            console.log("TURNING");
            sentenceNumberInHatsugen=0;
            hatsugenNumber++;
            DefineHatsugen(hatsugen,hatsugenNumber);
        }else if(knpCsv[KNP_csvRow][0]=="EOS"){
            console.log("EOS");

            //今までのまとめとして、文を分類
            ClassfyTaskOfSentence(hatsugen,hatsugenNumber,sentenceNumberInHatsugen);

            //次の文へ
            sentenceNumberInHatsugen++;
            DefineSentence(hatsugen,hatsugenNumber,sentenceNumberInHatsugen);
        }else if (judgeJapanese(knpCsv[KNP_csvRow][0]) == 1) {

            console.log("This is Japanese.");

            DefineKihonku(hatsugen,hatsugenNumber,sentenceNumberInHatsugen,kihonkuNumber);

            hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].kakattekuruKuNumber=ExtractNumber(knpCsv[KNP_csvRow-1][1]);

            hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].words[0] = knpCsv[KNP_csvRow][1];

            //発言・文の判断

            hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].task = ClassifyTaskOfWord(hatsugenNumber,sentenceNumberInHatsugen,hatsugen,newLoveDictionary,newWorkDictionary,newFriendDictionary);

            KNP_csvRow++;
            while(judgeJapanese(knpCsv[KNP_csvRow][0]) == 1){
                hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].words += knpCsv[KNP_csvRow][1];
                KNP_csvRow++;
            }
            KNP_csvRow--;//入れないと、EOSの行を飛ばしちゃう

            kihonkuNumber++;
        }else{
            //console.log(knpCsv[KNP_csvRow]);
        }
    }

    //要素：かかる句、かかられる句、愛交友仕事分類
};
/*
let ClassifyTaskOfKihonku = (kihonku,kihonkuNumber) => {
    ClassifyTaskOfWord(kihonku[kihonkuNumber].words[0]);
};
*/
let ClassifyTaskOfWord = (hatsugenNumber,sentenceNumberInHatsugen,wordLookedNow,newLoveDictionary,newWorkDictionary,newFriendDictionary) => {
    if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
        //wordLookedNowがある行の1列目の値（類似度）を足す
        return "love";
    }else if(newWorkDictionary[0].indexOf(wordLookedNow)!=-1){
        //wordLookedNowがある行の1列目の値（類似度）を足す
        return "work";
    }else if(newFriendDictionary[0].indexOf(wordLookedNow)!=-1){
        //wordLookedNowがある行の1列目の値（類似度）を足す
        return "friend"
    }
};



function judgeKakaruSide(kihonku,kakarareru){
    //その丹後区にかかるものを判定
    //かかる側を優先する
    //if(係る側が愛か交友か仕事に分類されている){そっちを優先する}
    if(kihonku[kihonku[kakarareru].kakattekuruNumber].task!=null){
        kihonku[kakarareru].task = kihonku[kihonku[kakarareru].kakattekuruNumber].task;
    }
}

//日本語か否か判定　kimizuka.hatenablog.com/entry/2013/12/22/011458
function judgeJapanese(txt) {
    if (typeof txt !== "string") {
        return false;
    }

    var i = txt.length,
        escapeTxt;

    while(i--) {
        escapeTxt = escape(txt.substring(i, i + 1));
        if (escapeTxt.length >= 6) {
            return true;
        }
    }

    return false;
}

function csv2Array(filePath) { //csvﾌｧｲﾙﾉ相対ﾊﾟｽor絶対ﾊﾟｽ
    var csvData = [];
    var data = new XMLHttpRequest();
    data.open("GET", filePath, false); //true:非同期,false:同期
    data.send(null);
    var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
    var lines = data.responseText.split(LF);
    for (var i = 0; i < lines.length;++i) {
        var cells = lines[i].split(",");
        if( cells.length != 1 ) {
            csvData.push(cells);
        }
    }
    console.log("return csvdata");

    //csvData = TransposeMatrix(csvData);
    return csvData;
}

function C (a, b, c) {
    a[c] = (a[c] || []).concat (b);
    return a;
}

function B (a, b, c) {
    return b.reduce (C, a);
}

function TransposeMatrix(ary) {
    return ary.reduce (B, []);
}

let ExtractNumber=(originalText)=>{
    let returnText;
    returnText=parseInt(originalText, 10); //-123
    // qiita.com/simiraaaa/items/2fc2c10e041963fc34fc
    return returnText;
};

export {processKnp};