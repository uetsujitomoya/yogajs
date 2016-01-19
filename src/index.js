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

/*
$('file-input').on('change',function(){

});
*/


document.getElementById('load-button').addEventListener('click', function () {
  console.log("read start");
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    console.log(event);
    var result = funcReaderOnload(event,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2);
    keitaisokaiseki = result.keitaisokaiseki;
    chboxlist = result.chboxlist;
    chboxlist2 = result.chboxlist2;
    hatsugen =  result.hatsugen;
    bun = result.bun;
    RGBlist = result.RGBlist;
    checked = result.checked;
    checked2 = result.checked2;
    console.log("onchangeの外");
    document.getElementById('radio_buttons').onchange = () => {
    	console.log("chboxlist2");
    	console.log(chboxlist2);
    	console.log("onchangeの中");
    	setForViz(keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2);
    	console.log("checkbox依存部分終わり");
    };
  };
  console.log("reader.onload終了。これとなんちゃら(file)が並列してないといけない");
  reader.readAsText(file);
});
console.log("document.getElementById終了");
