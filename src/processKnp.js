var AcceptKnp = (c) =>{
  var file = document.getElementById('file-input').files[0];
  var name = file.name;
  var reader = new FileReader();
  reader.onload = function(event) {
    var result = ReadKnp();
  };
  reader.readAsText(file);
};

var ReadKnp = (c) =>{



    //dictionaryが入ったことを認識→ストレージも変える

    //csvを辞書に変換
    music = $.csv.toArrays(csv);


    //

    //1.辞書の条件を配列かobjectとして定義しておく
    //2.それをcsvの内容に入れ替える

    //3.点数も表にする。

    //ヒットしたら点数加えてブレイク

    //最後にその文がどの分類か判定

    //ストレージ名をわかりやすくし、分類ラベル名を文字列に変える


    //dictionaryが入ったことを認識→ストレージも変える

    var test4;

    test4=1;
  
};
