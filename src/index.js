import {setForViz} from "./svg.js"
import {funcReaderOnload} from "./wordparse.js"
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
  console.log("file");
  console.log(file);
  var bunrui = document.getElementById('bunrui-input').files[0];
  var reader = new FileReader();
  var bunruireader = new FileReader();
  reader.readAsText(bunrui);
  reader.onload = function(event) {
    console.log("reader");
  	console.log(reader);
    console.log("event");
  	console.log(event);
    var result = funcReaderOnload(event,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,bunrui);
  };
  reader.readAsText(file);
});
