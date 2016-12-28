
import $ from 'jquery';



var AcceptDictionary = (name,event,keitaisokaiseki,chboxlist,chboxlist2,questionClassification,talkOrijinalByTurn,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) =>{
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


    //csv

/*
    var baitoArray = csv2Array('baito.csv');
    var hahaArray = csv2Array('haha.csv');
    var imoutoArray = csv2Array('imouto.csv');

    let newLoveDictionary = [];

    newLoveDictionary=newLoveDictionary.push(baitoArray,hahaArray,imoutoArray);
    //上がダメだったら0行目と1行目それぞれでpush

    var jyoushiArray = csv2Array('jyoushi.csv');
    var kareshiArray = csv2Array('kareshi.csv');
    var shigotoArray = csv2Array('shigoto.csv');

    let newWorkDictionary = [];
    newWorkDictionary=newWorkDictionary.push(jyoushiArray,kareshiArray,shigotoArray);

    var shinyuuArray = csv2Array('shinyuu.csv');
    var tomodachiArray = csv2Array('tomodachi.csv');
    var yuujinArray = csv2Array('yuujin.csv');

    let newFriendDictionary = [];
    newFriendDictionary=newFriendDictionary.push(shinyuuArray,tomodachiArray,yuujinArray);
    */

/*
    let newLoveDictionary = csv2Array('newLoveDictionary.csv');
    let newWorkDictionary = csv2Array('newLoveDictionary.csv');
    let newFriendDictionary = csv2Array('newLoveDictionary.csv');
    */

    console.log(dictionaryFromWord2Vec);
    //中身確認してから下を書き換える
    //↑中身確認してダメだったら転置する

    //csv9個分について　Arrayに追加する

    let newOneDictionary=[];

    //ヒットしたら点数加えてブレイク


    //var testArray = [3, 8, 13, true, 'あいうえお', 8, 10];


    //形態素解析してループさせる

    //完成した1個のArrayについて、以下をおこなう。

    //window.alert(testArray.indexOf(8));             // 1がアラートされる
    //window.alert(testArray.indexOf('あいうえお'));  // 4がアラートされる

    let wordLookedNow;
    if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][0]+=newLoveDictionary[1][newLoveDictionary[0].indexOf(wordLookedNow)];
        //wordLookedNowがある行の1列目の値（類似度）を足す
    }else if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][2]+=newLoveDictionary[1][newLoveDictionary[0].indexOf(wordLookedNow)];
        //wordLookedNowがある行の1列目の値（類似度）を足す
    }else if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][1]+=newLoveDictionary[1][newLoveDictionary[0].indexOf(wordLookedNow)];
        //wordLookedNowがある行の1列目の値（類似度）を足す
    }

    //最後にその文がどの分類か判定

    if(RGB[hatsugenNumber][sentenceNumberInHatsugen][0] >= RGB[hatsugenNumber][sentenceNumberInHatsugen][1]){
        RGB[hatsugenNumber][sentenceNumberInHatsugen][1] =0;
        if( RGB[hatsugenNumber][sentenceNumberInHatsugen][0] >= RGB[hatsugenNumber][sentenceNumberInHatsugen][2] ){
            RGB[hatsugenNumber][sentenceNumberInHatsugen][2] =0;
        }else{
            RGB[hatsugenNumber][sentenceNumberInHatsugen][0] =0;
        }
    }else{
        RGB[hatsugenNumber][sentenceNumberInHatsugen][0] =0;
        if( RGB[hatsugenNumber][sentenceNumberInHatsugen][1] >= RGB[hatsugenNumber][sentenceNumberInHatsugen][2] ){
            RGB[hatsugenNumber][sentenceNumberInHatsugen][2] =0;
        }else{
            RGB[hatsugenNumber][sentenceNumberInHatsugen][1] =0;
        }
    }


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


function TransposeMatrix(ary) {
    return ary.map( (a, i) => a.map( (v, j) => ary[j][i] ) )
}