/* global kuromoji */
import {color, svg, force, width, height, setForViz, funcReaderOnload} from "./svg.js"
import "kuromoji"
//import "jquery"

//var $ = require('jquery');
var keitaisokaiseki = []; //このlengthは段落数
var RGBlist  = [];//checkboxのセレクト結果
var checkboxlist=[];//checkboxに入る単語に1+RGBどれかの情報が3次元
var chboxlist=[];//通し番号


/*
$('file-input').on('change',function(){

});
*/


document.getElementById('load-button').addEventListener('click', function () {
  console.log("read start");
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    funcReaderOnload(event,keitaisokaiseki,checkboxlist,chboxlist,RGBlist);
    //これか。
    document.getElementById('check-button').addEventListener('click', function () {
      //check配列でonの単語について、文を舐めてRGBlistをつくる。
      //偶奇1setでカウント（同じm内に収める）
      setForViz(keitaisokaiseki,checkboxlist,chboxlist,RGBlist);
    });
    //checkbox依存部分終わり
  };//reader.onload終了。これとなんちゃら(file)が並列してないといけない
  reader.readAsText(file);
});//document.getElementById終了
