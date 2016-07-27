//import {setForViz} from "./svg.js";
import {funcReaderOnload} from "./wordparse.js";
//import $ from 'jquery';
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

  var data=localStorage;


  var ary = window.localStorage; //http://hakuhin.jp/js/storage.html#STORAGE_00
  console.log("ary");
  console.log(ary);
  var blob = new Blob([ary], {type: "text/csv"});
  var url = URL.createObjectURL(blob);
  var a = document.querySelector("#results"); // id of the <a> element to render the download link
  a.href = url;
  a.download = "file.csv";

});
