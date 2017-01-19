
//import {csv2Array} from "./index.js";

let knpCsv = csv2Array('../knp/text0knptab.csv');



let processKnp = (name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) =>{
    //読み込ませる
    AcceptKnp(knpCsv);

    //基本句の定義
    DefineKihonku(knpCsv);

    //基本句の最初の単語をタスク判定
    knpCsv.forEach((i)=>{
        judgeTaskOfKihonku(knpCsv);
    });
    //そのタスクを基本句のタスクとする

    //その基本句がかかるタスクに愛交友仕事のどれかが入ってる
    //基本句の最初の単語をタスク判定
    knpCsv.forEach((i)=>{
        judgeTaskOfSentence(knpCsv);
    });

    //上側を優先して、その文のタスクを確定

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

let DefineKihonku = () => {
    //基本句オブジェクト作成
    let kihonku=[];

    //かかってくる句の愛交友仕事が指定されていれば、その文の分類をやめる
    kihonku[kihonkuNumber]={
        orijinal:[],
        kakattekuruKuNumber:null,
        kakariniikuKuNumber:null,
        task:null
    };

    //orijinalの配列をつくるkeitaisokaiseki[]

    //次の＋までを取得して単語とする
    for(knpNumber=0;knpNumber<knpCsv.length;knpNumber++)
    {
        if (judgeJapanese() == 1) {
            kihonku[kihonkuNumber].words += knpCsv[kihonkuNumber][1];
            continue;
        }
        break;
    }

    //要素：かかる句、かかられる句、愛交友仕事分類
};

let judgeTaskOfKihonku = () => {
    judgeTaskOfWord(kihonku[kihonkuNumber].tango[0]);
};

let judgeTaskOfWord = () => {
    if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][0]+=newLoveDictionary[1][newLoveDictionary[0].indexOf(wordLookedNow)];
        //wordLookedNowがある行の1列目の値（類似度）を足す
    }else if(newWorkDictionary[0].indexOf(wordLookedNow)!=-1){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][2]+=newWorkDictionary[1][newWorkDictionary[0].indexOf(wordLookedNow)];
        //wordLookedNowがある行の1列目の値（類似度）を足す
    }else if(newFriendDictionary[0].indexOf(wordLookedNow)!=-1){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][1]+=newFriendDictionary[1][newFriendDictionary[0].indexOf(wordLookedNow)];
        //wordLookedNowがある行の1列目の値（類似度）を足す
    }
};

function judgeTaskOfSentence(){
    //最後にその文がどの分類か判定

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
    return csvData;
}