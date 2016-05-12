import {setForViz} from "./svg.js";
import {funcReaderOnload} from "./wordparse.js";
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
  var name = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {
    var result = funcReaderOnload(name,event,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
  };
  reader.readAsText(file);
});
