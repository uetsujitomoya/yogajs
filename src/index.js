/* global kuromoji */
import {setForViz} from "./svg.js"
import {funcReaderOnload} from "./wordparse.js"

//import "jquery"

//var $ = require('jquery');
var keitaisokaiseki = []; //このlengthは段落数
var RGBlist  = [];//checkboxのセレクト結果
var checkboxlist=[];//checkboxに入る単語に1+RGBどれかの情報が3次元
var chboxlist=[];//通し番号

var hatsugen =[];
var bun = [];

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
    funcReaderOnload(event,keitaisokaiseki,checkboxlist,chboxlist,RGBlist,hatsugen,bun);
    document.getElementById('radio_buttons').onchange = () => {
    	setForViz(keitaisokaiseki,checkboxlist,chboxlist,RGBlist,hatsugen,bun);
    };
    //checkbox依存部分終わり
  };//reader.onload終了。これとなんちゃら(file)が並列してないといけない
  reader.readAsText(file);
});//document.getElementById終了
