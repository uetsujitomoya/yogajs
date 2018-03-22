
import {classifyWithFirstWordDictionary} from './js/counselorEducation/wordparse'


import { mainOfCharaChart } from './js/charaChart/main'

//import {classifyWithFirstWordDictionary} from './js/counselorEducation/wordparse.js'

import $ from 'jquery'
import { clearStorage } from './js/counselorEducation/sub/clearStorage'

const knpForm = document.getElementById("knp");

/*knpForm.addEventListener("change",function(knpChangeEvt){
  var knpCsv = knpChangeEvt.target.files[0];
  var knpReader = new FileReader();
  knpReader.readAsText(knpCsv);
  //KNP出力結果のCSVを読込終了後の処理
  knpReader.onload = function(knpOnloadEv){
    const radio = document.getElementById('r').children
    console.log(radio)
    if(isOutputMode(radio)){
      //まだ手動修正後CSVを持っていない場合
      const firstResult = mainOfCharaChart(knpReader.result,null,true)
      //2個目のCSVを読む
      var bunArrForm = document.getElementById("bunarr");
      bunArrForm.addEventListener("change",function(bunArrChangeEvt){
        var bunArrCsv = bunArrChangeEvt.target.files[0];
        var bunArrReader = new FileReader();
        bunArrReader.readAsText(bunArrCsv);
        bunArrReader.onload = function(bunArrOnloadEv){
          const secondResult = mainOfCharaChart(knpReader.result,bunArrReader.result,false)
        }
      },false);
    }else{
      //既に手動修正後CSVを持っている場合
      //2個目のCSVを読む
      var bunArrForm = document.getElementById("bunarr");
      bunArrForm.addEventListener("change",function(bunArrChangeEvt){
        var bunArrCsv = bunArrChangeEvt.target.files[0];
        var bunArrReader = new FileReader();
        bunArrReader.readAsText(bunArrCsv);
        bunArrReader.onload = function(bunArrOnloadEv){
          const charaChartResult = mainOfCharaChart(knpReader.result,bunArrReader.result,false)
        }
      },false);
    }
  }
},false);*/

const isOutputMode=(radio)=>{

  if(radio[1].control.checked){
    return true
  }else{
    return false
  }
}

clearStorage()

let storageArrayFromKamata = csv2Array('csv/storage170421fromKamata.csv')
console.log('storageFromKamata')
console.log(storageArrayFromKamata)

var startTime = new Date()

let newLoveDictionary = csv2Array('../oldLoveDic.csv')
newLoveDictionary = TransposeMatrix(newLoveDictionary)

let newWorkDictionary = csv2Array('workUtf8.csv')
newWorkDictionary = TransposeMatrix(newWorkDictionary)
console.log('newWorkADictionary')
console.log(newWorkDictionary)

let newFriendDictionary = csv2Array('friendUtf8.csv')

newFriendDictionary = TransposeMatrix(newFriendDictionary)

var keitaisokaiseki = [] // このlengthは段落数
var questionClassification = []// checkboxのセレクト結果
var chboxlist = []// 通し番号
var hatsugen = []
var bun = []
var chboxlist2 = []
var checked = []
var checked2 = []
var taiou = []
var taiou2 = []
var chboxlength, chboxlength2
let RGB = []
var test2
let RGBlist = []

let checkboxlist = []

document.getElementById('load-button').addEventListener('click', function () {
  var file = document.getElementById('file-input').files[0]
  var name = file.name
  var reader = new FileReader()
  reader.onload = function (event) {
    // let result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
    let originalText = event.target.result

    console.log('%center ClassifyWithFirstWordDictionary 85', 'color:red')
    let resultWithNewDictionary = classifyWithFirstWordDictionary(name, keitaisokaiseki, checkboxlist, chboxlist, chboxlist2, RGBlist, hatsugen, bun, checked, checked2, taiou, taiou2, chboxlength, chboxlength2, originalText)
  }
  reader.readAsText(file)
})

function csv2Array (filePath) { // csvﾌｧｲﾙﾉ相対ﾊﾟｽor絶対ﾊﾟｽ

  var csvData = []
  var data = new XMLHttpRequest()
  data.open('GET', filePath, false) // true:非同期,false:同期
  data.send(null)
  var LF = String.fromCharCode(10) // 改行ｺｰﾄﾞ
  var lines = data.responseText.split(LF)
  for (var i = 0; i < lines.length; ++i) {
    var cells = lines[i].split(',')
    if (cells.length != 1) {
      csvData.push(cells)
    }
  }
  return csvData
}

function C (a, b, c) {
  a[c] = (a[c] || []).concat(b)
  return a
}

function B (a, b, c) {
  return b.reduce(C, a)
}

function TransposeMatrix (ary) {return ary.reduce(B, [])}

document.getElementById('storageClear-button').addEventListener('click', function () {
  console.log(localStorage.clear)
  localStorage.clear();
});



//export {csv2Arr, TransposeMatrix, downloadAsCSV}

// この関数を実行するとCSVのDL画面に鳴る
function downloadAsCSV (filename, csv_array) {
  let filenameWithExtension = filename + '.csv'

  // 配列をTAB区切り文字列に変換
  var csv_string = ''
  for (let i = 0; i < csv_array.length; i++) {
    csv_string += csv_array[i].join(',')
    csv_string += '\n'
  }

  // ファイル作成
  let blob = new Blob([csv_string], {
    type: 'text/csv'
  })

  // ダウンロード実行...(2)
  if (window.navigator.msSaveOrOpenBlob) {
    // IEの場合
    navigator.msSaveBlob(blob, filenameWithExtension)
  } else {
    // IE以外(Chrome, Firefox)
    var downloadLink = $('<a></a>')
    downloadLink.attr('href', window.URL.createObjectURL(blob))
    downloadLink.attr('download', filenameWithExtension)
    downloadLink.attr('target', '_blank')

    $('body').append(downloadLink)
    downloadLink[0].click()
    downloadLink.remove()
  }
}

let storage2csv = () => {
  // var storage = localStorage; //http://hakuhin.jp/js/storage.html#STORAGE_00

  // ウェブストレージに対応している http://hakuhin.jp/js/storage.html#STORAGE_GET_KEYS
  // if(window.localStorage){

  // ------------------------------------------------------------
  // キーの総数を取得する
  // ------------------------------------------------------------
  var num = window.localStorage.length

  // ------------------------------------------------------------
  // ストレージからすべてのキーを取得する
  // ------------------------------------------------------------
  var i
  let csv_array = []
  for (i = 0; i < num; i++) {
    csv_array[i] = []

    // 位置を指定して、ストレージからキーを取得する
    csv_array[i][0] = window.localStorage.key(i)

    // ストレージからデータを取得する

    csv_array[i][1] = window.localStorage.getItem(csv_array[i][0])

    // 出力テスト
    console.log('name:' + csv_array[i][0] + ' value:' + csv_array[i][1])
  }
  console.log('csv_array')
  console.log(csv_array)

  // }

  // CSVに記載するデータ配列
  return csv_array
}

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


export {csv2Array, TransposeMatrix, downloadAsCSV}

