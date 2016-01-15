import {setForViz} from "./svg.js"
import {funcReaderOnload} from "./wordparse.js"
var keitaisokaiseki = []; //このlengthは段落数
var RGBlist  = [];//checkboxのセレクト結果
var chboxlist=[];//通し番号

var hatsugen =[];
var bun = [];
var chboxlist2=[];
document.getElementById('load-button').addEventListener('click', function () {
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var result = funcReaderOnload(event,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun);
    keitaisokaiseki = result.keitaisokaiseki;
    chboxlist = result.chboxlist;
    chboxlist2 = result.chboxlist2;
    hatsugen =  result.hatsugen;
    bun = result.bun;
    RGBlist = result.RGBlist;
    document.getElementById('radio_buttons').onchange = () => {
    	setForViz(keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun);
    };
  };
  reader.readAsText(file);
});
