/* global kuromoji */
import {color, svg, force, width, height, setForViz} from "./svg.js"
import {wordparse} from "./wordparse.js"
import {wordparse2select} from "./wordparse2select.js"
import {select} from "./select.js"


//import "jquery"

//var $ = require('jquery');
var keitaisokaiseki = []; //このlengthは段落数
var RGBlist  = [];//checkboxのセレクト結果
var checkboxlist=[];//checkboxに入る単語に1+RGBどれかの情報が3次元
var chboxlist=[];//通し番号
var RGB = [];//どの発言にRGBが入っているか大まかに色分け
var miserables={"nodes":[],"links":[]};

/*
$('file-input').on('change',function(){

});
*/

document.getElementById('load-button').addEventListener('click', function () {
  console.log("read start");
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var data = JSON.parse(event.target.result);
    wordparse(data,keitaisokaiseki,checkboxlist,chboxlist,RGBlist,RGB);

    wordparse2select(keitaisokaiseki, miserables);

    select(checkboxlist,keitaisokaiseki,miserables,chboxlist,RGB);

    document.getElementById('check-button').addEventListener('click', function () {
      //check配列でonの単語について、文を舐めてRGBlistをつくる。
      //偶奇1setでカウント（同じm内に収める）
      setForViz(keitaisokaiseki,checkboxlist,chboxlist,RGBlist);
    });
    //checkbox依存部分終わり

  };//reader.onload終了。これとなんちゃら(file)が並列してないといけない

  reader.readAsText(file);

});//document.getElementById終了
