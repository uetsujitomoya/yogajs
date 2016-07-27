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

  //let csv_string=convertTocsv(ary);

  //UTF-16に変換...(1)
  /*var array = [];
  for (var i=0; i<csv_string.length; i++){
    array.push(csv_string.charCodeAt(i));
  *}*/
  //var csv_contents = new Uint16Array(array);

  //ファイル作成
  var blob = new Blob([ary] , {
    type: "text/plain"
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

//http://qiita.com/kenchan0130/items/11c3abab109405379ffb
/*var convertTocsv = function(objArray) {
  //if (!(objArray[0] instanceof Array)) return objArray.join(',');
  var array = (typeof(objArray) != 'object') ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line !== '') line += ',';
      line += '"' + array[i][index] + '"';
  *  }
    str += line + '\r\n';
  *}

  return str;
*};
*/
