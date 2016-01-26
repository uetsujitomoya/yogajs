/* global kuromoji */
import {setForViz} from "./svg.js"
import {funcReaderOnload} from "./wordparse.js"

//import "jquery"

//var $ = require('jquery');
var keitaisokaiseki = []; //このlengthは段落数
var RGBlist  = [];//checkboxのセレクト結果
var chboxlist=[];//通し番号
var hatsugen =[];
var bun = [];
var chboxlist2=[];
var checked = [];
var checked2 = [];
var taiou=[];
var chboxlength,chboxlength2;

/*
$('file-input').on('change',function(){

});
*/


document.getElementById('load-button').addEventListener('click', function () {
  //console.log("read start");
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    //console.log(event);
    var result = funcReaderOnload(event,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2);
    //console.log("result");
    //console.log(result);
    //console.log("onchangeの外");

  };
  //console.log("reader.onload終了。これとなんちゃら(file)が並列してないといけない");
  reader.readAsText(file);
});
//console.log("document.getElementById終了");
