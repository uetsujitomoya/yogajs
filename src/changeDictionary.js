
import $ from 'jquery';



var AcceptDictionary = (c) =>{
  var file = document.getElementById('file-input').files[0];
  var name = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {
    var result = ReadKnp();
  };
  reader.readAsText(file);
};

var ReadDictionary = (c) =>{

 //dictionaryが入ったことを認識→ストレージも変える

  //csvを辞書に変換
  music = $.csv.toArrays(csv);

  //1.辞書の条件を配列かobjectとして定義しておく
  //2.それをcsvの内容に入れ替える・・・は要らんか。

    //3.点数も表にする。



    var dictionaryFromWord2Vec = csv2Array('HDFaceVertex.csv');
    console.log(dictionaryFromWord2Vec);
    //中身確認してから下を書き換える
    //↑中身確認してダメだったら転置する



    //ヒットしたら点数加えてブレイク


    var testArray = [3, 8, 13, true, 'あいうえお', 8, 10];


    //形態素解析してループさせる

    window.alert(testArray.indexOf(8));             // 1がアラートされる
    window.alert(testArray.indexOf('あいうえお'));  // 4がアラートされる




    //最後にその文がどの分類か判定

    //ストレージ名をわかりやすくし、分類ラベル名を文字列に変える


    //dictionaryが入ったことを認識→ストレージも変える


    //判定結果をモジュール化してwordparse.js・・・じゃなくてRGBとRGBlistに引き渡してselect.jsに受け渡す



    var sResult = select(name,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

    checkboxlist = sResult.checkboxlist;
    chboxlist = sResult.chboxlist;
    chboxlist2 = sResult.chboxlist2;
    RGB = sResult.RGB;
    RGBlist = sResult.RGBlist;

    checked = sResult.checked;
    checked2 = sResult.checked2;
    taiou = sResult.taiou;
    taiou2 = sResult.taiou2;
    chboxlength = sResult.chboxlength;
    chboxlength2 = sResult.chboxlength2;
    //graph = sResult.graph;
    //console.log("chboxlength2=%d",chboxlength2)




    var vResult = setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);//形態素解析後に1度目の描画
    chboxlist = vResult.chboxlist;
    chboxlist2 = vResult.chboxlist2;
    RGBlist = vResult.RGBlist;
    checked = vResult.checked;
    checked2 = vResult.checked2;
    chboxlength = vResult.chboxlength;
    chboxlength2 = vResult.chboxlength2;
    ranshin = vResult.ranshin;

    //これは後ろじゃないと、選択肢が反映されない？
    for(c=1;c<=chboxlength;c++){
        makeOnClick(c);
    }
    for(c=1;c<=chboxlength2;c++){
        makeOnClickS(c);
    }


    document.getElementById('radio_buttons').onchange = () => {
        setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);
    };//graphの形状を切り替えた際もここで再描画される

    //graphのラジオボタン変わったらまた描画

    return{
        name:name,RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2,ranshin:ranshin
    };


    var test4;

    test4=1;


};


function csv2Array(filePath) { //csvﾌｧｲﾙﾉ相対ﾊﾟｽor絶対ﾊﾟｽ
    var csvData = [];
    var data = new XMLHttpRequest();
    data.open("GET", filePath, false); //true:非同期,false:同期
    data.send(null);
    var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
    var lines = data.responseText.split(LF);
    for (var i = 0; i < lines.length;++i) {
        var cells = lines[i].split(",");
        if( cells.length != 1 ) {
            csvData.push(cells);
        }
    }
    return csvData;
}
