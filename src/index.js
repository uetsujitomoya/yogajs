import {funcReaderOnload} from "./wordparse.js";
import $ from 'jquery';
var keitaisokaiseki = []; //このlengthは段落数
var RGBlist  = [];//checkboxのセレクト結果
var chboxlist=[];//通し番号
var hatsugen =[];
var bun = [];
var chboxlist2=[];
var checked = [];
var checked2 = [];
var taiou=[];
var taiou2=[];
var chboxlength,chboxlength2;
document.getElementById('load-button').addEventListener('click', function () {
  var file = document.getElementById('file-input').files[0];
  var name = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {
    var result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
  };
  reader.readAsText(file);
});
document.getElementById('storageSave-button').addEventListener('click', function () {

  let file_name="storage"+Date()+".csv";

  var ary = window.localStorage; //http://hakuhin.jp/js/storage.html#STORAGE_00


  // ウェブストレージに対応している http://hakuhin.jp/js/storage.html#STORAGE_GET_KEYS
  //if(window.localStorage){



  // ------------------------------------------------------------
  // キーの総数を取得する
  // ------------------------------------------------------------
  var num = window.sessionStorage.length;

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

  //}

  //CSVに記載するデータ配列

  //配列をTAB区切り文字列に変換
  var csv_string = "";
  for (i=0; i<csv_array.length; i++) {
    csv_string += csv_array[i].join("\t");
    csv_string += '\r\n';
  }

  //BOM追加
  csv_string = "\ufffe" + csv_string; //UTF-16
  console.log (csv_string);

  //実行環境がLEかどうか判別...(3)
  if (isLittleEndian()) {

    //実行環境のエンディアンがLEならTypedArrayを利用
    var array = [];
    for (var i=0; i<csv_string.length; i++){
      array.push(csv_string.charCodeAt(i));
    }
    var csv_contents = new Uint16Array(array);

  } else {

    //LEでない場合はDataViewでUTF-16LEのArrayBufferを作成
    var array_buffer = new ArrayBuffer(csv_string.length * 2);
    var data_view = new DataView(array_buffer);
    for (var i=0,j=0; i<csv_string.length; i++,j=i*2) {
      data_view.setUint16( j, csv_string.charCodeAt(i), true ); //第3引数にtrueを渡すとLEになる
    }
    var csv_contents = array_buffer
  }

  //ファイル作成
  var blob = new Blob([csv_contents] , {
    type: "text/csv;charset=utf-16;"
  });

  //ダウンロード実行
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

  // --------------------------------------
  // 実行環境のエンディアンがLEかどうか判別
  // --------------------------------------
  function isLittleEndian(){
    if ((new Uint8Array((new Uint16Array([0x00ff])).buffer))[0]) return true;
    return false;
  }
});

//let csv_string=convertTocsv(ary);

//http://qiita.com/kenchan0130/items/11c3abab109405379ffb
