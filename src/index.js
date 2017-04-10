import {ClassifyWithFirstWordDictionary} from "./js/wordparse1608030008.js";
//import {AcceptKnp} from "./processKnp.js";
import {ClassifyWithKNP} from "./processKnp.js"; //processKNP
import {ClassifyWithWordDictionary} from "./changeDictionary.js"; //AcceptDictionary
import $ from 'jquery';
//import {CreateSwitchClassificationMethod} from "./SwitchClassificationMethod.js"; //AcceptDictionary

//var dictionaryFromWord2Vec = csv2Array('HDFaceVertex.csv');
var startTime = new Date();

let newLoveDictionary = csv2Array('../oldLoveDic.csv');
newLoveDictionary = TransposeMatrix(newLoveDictionary);

let newWorkDictionary = csv2Array('workUtf8.csv');
newWorkDictionary = TransposeMatrix(newWorkDictionary);
console.log("newWorkADictionary");
console.log(newWorkDictionary);

let newFriendDictionary = csv2Array('friendUtf8.csv');
newFriendDictionary = TransposeMatrix(newFriendDictionary);

var keitaisokaiseki = []; //このlengthは段落数
var questionClassification  = [];//checkboxのセレクト結果
var chboxlist=[];//通し番号
var hatsugen =[];
var bun = [];
var chboxlist2=[];
var checked = [];
var checked2 = [];
var taiou=[];
var taiou2=[];
var chboxlength,chboxlength2;
let RGB=[];
var test2;

let switchClassificationMethod=()=>{
    const SwitchClassificationMethodRadio = document.getElementById("SwitchClassificationMethod").children;
    if(SwitchClassificationMethodRadio[0].control.checked==true){
        //単純な単語辞書を用いた分類
        //ClassifyWithWordDictionary(name,event,keitaisokaiseki,chboxlist,chboxlist2,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,newLoveDictionary,newWorkDictionary,newFriendDictionary);
        document.getElementById('load-button').addEventListener('click', function () {

            var file = document.getElementById('file-input').files[0];
            var name = file.name;
            var reader = new FileReader();
            reader.onload = function(event) {
                //var result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
                console.log("%center ClassifyWithWordDictionary",'color:red');
                let resultWithNewDictionary = ClassifyWithWordDictionary(name,event,keitaisokaiseki,chboxlist,chboxlist2,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,newLoveDictionary,newWorkDictionary,newFriendDictionary);
            };
            reader.readAsText(file);

        });
    }else if(SwitchClassificationMethodRadio[1].control.checked==true){
        //係り受け解析を用いた分類
        console.log("%center ClassifyWithWordKNP",'color:red');
        ClassifyWithKNP(startTime,name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,newLoveDictionary,newWorkDictionary,newFriendDictionary,RGB);
    }else{
        //SVMを用いた分類
        console.log("%center ClassifyWithSVM",'color:red');
        ClassifyWithSVM();
    }
};

/*上部分

CreateSwitchClassificationMethod();
switchClassificationMethod();

*/

//console.log("Before processKNP");

//let resultWithKNP = processKnp(startTime,name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,newLoveDictionary,newWorkDictionary,newFriendDictionary,RGB);

//console.log("After resultWithKNP");

/*document.getElementById('load-button').addEventListener('click', function () {

  var file = document.getElementById('file-input').files[0];
  var name = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {*/
    //var result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
      console.log("%center ClassifyWithFirstWordDictionary",'color:red');
      let resultWithNewDictionary = ClassifyWithFirstWordDictionary(name,keitaisokaiseki,chboxlist,chboxlist2,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,newLoveDictionary,newWorkDictionary,newFriendDictionary);
  /*};
  reader.readAsText(file);

});*/

  /*170410knpLoadButton

document.getElementById('knpLoadButton').addEventListener('click',function () {

    var file = document.getElementById('knpLoadButton').files[0];//csv読み込めない
    var name = file.name;
    var reader = new FileReader();
    reader.onload = function(event) {
        //var result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
        //let resultWithNewDictionary = AcceptDictionary(name,event,keitaisokaiseki,chboxlist,chboxlist2,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,newLoveDictionary,newWorkDictionary,newFriendDictionary);
        //let resultWithKNP = processKnp(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2)
    };
    reader.readAsText(file);

});

  */

//document.getElementById('buttonToInputDictionary').addEventListener('click',AcceptDictionary(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2));

//storage出力

/*storageSave-button

document.getElementById('storageSave-button').addEventListener('click', ()=>{
    let csv_array=storage2csv();
    //KNPもCSVで読み込ませる
    downloadAsCSV("storage",csv_array);
});

*/

//let file_name="storage"+Date()+".csv";
//let filenameWithExtension="storage.csv";

//let csv_string=convertTocsv(ary);

//http://qiita.com/kenchan0130/items/11c3abab109405379ffb

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

/*storageSave-button
document.getElementById('storageSave-button').addEventListener('click', function () {
    localStorage.clear();
});
*/

//この関数を実行するとCSVのDL画面に鳴る
function downloadAsCSV(filename, csv_array){

    let filenameWithExtension = filename+".csv";

    //配列をTAB区切り文字列に変換
    var csv_string = "";
    for (i=0; i<csv_array.length; i++) {
        csv_string += csv_array[i].join(",");
        csv_string += '\n';
    }

    //ファイル作成
    let blob = new Blob([csv_string] , {
        type: "text/csv"
    });

    //ダウンロード実行...(2)
    if (window.navigator.msSaveOrOpenBlob) {
        //IEの場合
        navigator.msSaveBlob(blob, filenameWithExtension);
    } else {
        //IE以外(Chrome, Firefox)
        var downloadLink = $('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', filenameWithExtension);
        downloadLink.attr('target', '_blank');

        $('body').append(downloadLink);
        downloadLink[0].click();
        downloadLink.remove();
    }
}

let storage2csv = () => {
    //var storage = localStorage; //http://hakuhin.jp/js/storage.html#STORAGE_00

    // ウェブストレージに対応している http://hakuhin.jp/js/storage.html#STORAGE_GET_KEYS
    //if(window.localStorage){

    // ------------------------------------------------------------
    // キーの総数を取得する
    // ------------------------------------------------------------
    var num = window.localStorage.length;

    // ------------------------------------------------------------
    // ストレージからすべてのキーを取得する
    // ------------------------------------------------------------
    var i;
    let csv_array=[];
    for(i=0;i< num;i++){
        csv_array[i]=[];

        // 位置を指定して、ストレージからキーを取得する
        csv_array[i][0] = window.localStorage.key(i);

        // ストレージからデータを取得する

        csv_array[i][1] = window.localStorage.getItem(csv_array[i][0]);

        // 出力テスト
        console.log("name:" + csv_array[i][0] + " value:" + csv_array[i][1]);
    }
    console.log("csv_array");
    console.log(csv_array);

    //}

    //CSVに記載するデータ配列
    return csv_array;
};

export {csv2Array,TransposeMatrix,downloadAsCSV};