
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


    //判定結果をモジュール化してwordparse.jsに受け渡す

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
