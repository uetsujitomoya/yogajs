//import {funcReaderOnload} from "./wordparse.js";
//import {AcceptKnp} from "./processKnp.js";
import {processKnp} from "./processKnp.js";
import {AcceptDictionary} from "./changeDictionary.js";
import $ from 'jquery';

//var dictionaryFromWord2Vec = csv2Array('HDFaceVertex.csv');

let newLoveDictionary = csv2Array('loveUtf8.csv');
newLoveDictionary = TransposeMatrix(newLoveDictionary);

let newWorkDictionary = csv2Array('workUtf8.csv');
newWorkDictionary = TransposeMatrix(newWorkDictionary);
console.log("newWorkDictionary");
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

console.log("Before processKNP");

let resultWithKNP = processKnp(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,newLoveDictionary,newWorkDictionary,newFriendDictionary,RGB);

console.log("After resultWithKNP");

document.getElementById('load-button').addEventListener('click', function () {


  var file = document.getElementById('file-input').files[0];
  var name = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {
    //var result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
      let resultWithNewDictionary = AcceptDictionary(name,event,keitaisokaiseki,chboxlist,chboxlist2,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,newLoveDictionary,newWorkDictionary,newFriendDictionary);
  };
  reader.readAsText(file);

});

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

//document.getElementById('buttonToInputDictionary').addEventListener('click',AcceptDictionary(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2));

//storage出力

document.getElementById('storageSave-button').addEventListener('click', function () {

  //let file_name="storage"+Date()+".csv";
  let file_name="storage.csv";

  var storage = localStorage; //http://hakuhin.jp/js/storage.html#STORAGE_00

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

    //KNPもCSVで読み込ませる

  //配列をTAB区切り文字列に変換
  var csv_string = "";
  for (i=0; i<csv_array.length; i++) {
    csv_string += csv_array[i].join(",");
    csv_string += '\n';
  }

  //ファイル作成
  var blob = new Blob([csv_string] , {
    type: "text/csv"
  });

  //ダウンロード実行...(2)
  if (window.navigator.msSaveOrOpenBlob) {
    //IEの場合
    navigator.msSaveBlob(blob, file_name);
  } else {
    //IE以外(Chrome, Firefox)
    var downloadLink = $('<a></a>');
    downloadLink.attr('href', window.URL.createObjectURL(blob));
    downloadLink.attr('download', file_name);
    downloadLink.attr('target', '_blank');

    $('body').append(downloadLink);
    downloadLink[0].click();
    downloadLink.remove();
  }
});

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

document.getElementById('storageSave-button').addEventListener('click', function () {
    localStorage.clear();
});

export {csv2Array,TransposeMatrix};