
import $ from 'jquery';

import "kuromoji";
import {select} from "./select.js";
import {setForViz} from "./svg.js";
import {makeOnClickS,makeOnClick} from "./wordparse.js";

var AcceptDictionary = (jsonFileName,event,keitaisokaiseki,chboxlist,chboxlist2,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,newLoveDictionary,newWorkDictionary,newFriendDictionary) =>{

    console.log("AcceptDictionary");


    //自か他か辞書取得

 //dictionaryが入ったことを認識→ストレージも変える

  //csvを辞書に変換
  //music = $.csv.toArrays(csv);

  //1.辞書の条件を配列かobjectとして定義しておく
  //2.それをcsvの内容に入れ替える・・・は要らんか。

    //3.点数も表にする。

    //csv

    //console.log(dictionaryFromWord2Vec);
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

    //以下、wordparseからパクった

    var startTime = new Date();
    console.log(startTime);

    var h,i,j,k,m,n,c,x,y,z;
    var hinshi = [];
    var RGB = [];
    let RGBlist=[];

    let ranshin = [];
    var tangoset = new Set();
    var tangosett = [];
    var miserables={"nodes":[],"links":[]};

    let checkboxlist=[];
    bun=[];//name,event,keitaisokaiseki,checkboxlist,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2

    var data = JSON.parse(event.target.result);

//ここでKNP(XML)の処理を開始

//辞書の読込

//連結

    //KNPを使用する場合kuromoji不要
    //Csvの??列目をhatsugenとして取り扱う（かかり先も持った2次元配列orOBJECTを要素とした1次元配列）

    return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
        const path = tokenizer.tokenize(data[0].a);
        let wordNumberParsedInMorphologicalAnalysis=0;

        var tangosuu=0;
        let hatsugenNumber=0;
        var kanjamoji=0;
        var kanjatango=0;
        var kanjabun=0;
        var serapimoji=0;
        var serapitango=0;
        var serapibun=0;
        var soudesuka=0;

        var storage = localStorage;//初回読み込み

        //下の段階すっとばして例の辞書使う

        while(wordNumberParsedInMorphologicalAnalysis<path.length){

            //以下、1発言ごと
            //間違ってたらこっからやり直せるようにしとく。やり直しナンバーもstorageに保存

            keitaisokaiseki[hatsugenNumber] = [];
            bun[hatsugenNumber] = [];
            hatsugen[hatsugenNumber] = "";
            hinshi[hatsugenNumber] = [];
            RGB[hatsugenNumber] = [];
            ranshin[hatsugenNumber] = [];
            if(hatsugenNumber%2==0){
                RGBlist[hatsugenNumber/2] = [0,0,0,0,0,0,0,0];
            }
            let sentenceNumberInHatsugen=0;
            tangosuu=0;
            while(wordNumberParsedInMorphologicalAnalysis<path.length){

                //以下、1文ごと

                keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen] = [];
                bun[hatsugenNumber][sentenceNumberInHatsugen]="";
                hinshi[hatsugenNumber][sentenceNumberInHatsugen]=[];
                keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen].length = 0;
                RGB[hatsugenNumber][sentenceNumberInHatsugen] = [0,0,0];
                ranshin[hatsugenNumber][sentenceNumberInHatsugen]=[0,0,0,0,0,0,0,0,0];
                let wordNumberInSentence=0;
                while(wordNumberParsedInMorphologicalAnalysis<path.length){
                    tangosuu++;

                    //以下、1語ごと

                    if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="。"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="？"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="?"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="："||path[wordNumberParsedInMorphologicalAnalysis].basic_form==":"||path[wordNumberParsedInMorphologicalAnalysis].word_id=="2613630"||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="･･･？："||path[wordNumberParsedInMorphologicalAnalysis].surface_form==")："
                        ||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="…"||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="……"||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="・・・"||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="･･･"||path[wordNumberParsedInMorphologicalAnalysis].surface_form.indexOf('〈') != -1||path[wordNumberParsedInMorphologicalAnalysis].surface_form.indexOf('〉') != -1){
                        break;
                    }
                    bun[hatsugenNumber][sentenceNumberInHatsugen] += path[wordNumberParsedInMorphologicalAnalysis].surface_form;
                    if(hatsugenNumber%2==1){
                        kanjatango++;
                        kanjamoji=kanjamoji+path[wordNumberParsedInMorphologicalAnalysis].surface_form.length;

                        let wordLookedNow = path[wordNumberParsedInMorphologicalAnalysis].basic_form;

                        //ここで係り受け解析を判定

                        if(newLoveDictionary[0].indexOf(wordLookedNow)!=-1){
                            RGB[hatsugenNumber][sentenceNumberInHatsugen][0]+=newLoveDictionary[1][newLoveDictionary[0].indexOf(wordLookedNow)];
                            //wordLookedNowがある行の1列目の値（類似度）を足す
                        }else if(newWorkDictionary[0].indexOf(wordLookedNow)!=-1){
                            RGB[hatsugenNumber][sentenceNumberInHatsugen][2]+=newWorkDictionary[1][newWorkDictionary[0].indexOf(wordLookedNow)];
                            //wordLookedNowがある行の1列目の値（類似度）を足す
                        }else if(newFriendDictionary[0].indexOf(wordLookedNow)!=-1){
                            RGB[hatsugenNumber][sentenceNumberInHatsugen][1]+=newFriendDictionary[1][newFriendDictionary[0].indexOf(wordLookedNow)];
                            //wordLookedNowがある行の1列目の値（類似度）を足す
                        }

                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="病"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="病気"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="ストレス"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="不調"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="過食"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="嘔吐"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="過食嘔吐"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][0]=1;
                            console.info("病気,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="無気力"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="気力"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="やる気"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][1]=1;
                            console.info("無気力,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="疑い"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="疑う"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="疑心暗鬼"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="疑心"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][2]=1;
                            console.info("疑い,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="注意"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="不注意"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="注意散漫"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="無自覚"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="自覚"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][3]=1;
                            console.info("不注意,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="引き延ばし"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="引き延ばす"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="怠慢"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="怠惰"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][4]=1;
                            console.info("怠慢,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="渇望"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="切望"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="欲しい"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="ほしい"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][5]=1;
                            console.info("渇望,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="妄想"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="空想"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="想い"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="ふける"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][6]=1;
                            console.info("妄想,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="抜け出す"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="打破"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="勝つ"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="戦う"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][7]=1;
                            console.info("新しい境地を見いだせぬこと,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="不安定"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="安定"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="落ち着く"){
                            ranshin[hatsugenNumber][sentenceNumberInHatsugen][8]=1;
                            console.info("心の不安定さ,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
                        }
                    }else if(hatsugenNumber%2==0){
                        serapitango++;
                        serapimoji=serapimoji+path[wordNumberParsedInMorphologicalAnalysis].surface_form.length;
                        if(path[wordNumberParsedInMorphologicalAnalysis].surface_form=="そう"&&path[wordNumberParsedInMorphologicalAnalysis+1].surface_form=="です"&&path[wordNumberParsedInMorphologicalAnalysis+2].surface_form=="か"){
                            soudesuka++;
                        }
                        if(path[wordNumberParsedInMorphologicalAnalysis].surface_form=="何"&&path[wordNumberParsedInMorphologicalAnalysis+1].surface_form=="か"){

                        }else if(path[wordNumberParsedInMorphologicalAnalysis].basic_form=="いかが"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="なんで"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どうして"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どの"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どのように"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="いつ"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どういう"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どなた"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どう"||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="何"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="誰"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どんな"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どのような"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="どこ"){
                            RGBlist[hatsugenNumber/2][3]=1;
                        }else if(path[wordNumberParsedInMorphologicalAnalysis].surface_form=="か"&&path[wordNumberParsedInMorphologicalAnalysis].pos=="助詞"){
                            RGBlist[hatsugenNumber/2][4]=1;
                        }else if(path[wordNumberParsedInMorphologicalAnalysis].surface_form=="ね"&&path[wordNumberParsedInMorphologicalAnalysis].pos=="助詞"){
                            RGBlist[hatsugenNumber/2][6]=1;
                        }
                    }

                    if(path[wordNumberParsedInMorphologicalAnalysis].pos_detail_1=="接尾"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="*"||path[wordNumberParsedInMorphologicalAnalysis].pos=="助詞"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="、"||path[wordNumberParsedInMorphologicalAnalysis].pos=="記号"||path[wordNumberParsedInMorphologicalAnalysis].pos=="助動詞"||path[wordNumberParsedInMorphologicalAnalysis].pos=="感動詞"||path[wordNumberParsedInMorphologicalAnalysis].pos=="接頭詞"||path[wordNumberParsedInMorphologicalAnalysis].pos_detail_1=="非自立"
                        ||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="する"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="いる"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="こういう"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="そういう"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="こう"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="する"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="こうした"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="いう"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="する"
                        ||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="なる"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="その"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="あの"||path[wordNumberParsedInMorphologicalAnalysis].pos_detail_1=="数"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="そう"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="気持ち"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="思い"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="思う"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="ある"){
                        wordNumberParsedInMorphologicalAnalysis++;
                        continue;
                    }
                    keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence] = path[wordNumberParsedInMorphologicalAnalysis].basic_form;

                    //以上、1語ごと
                    wordNumberParsedInMorphologicalAnalysis++;
                    wordNumberInSentence++;
                }

                //KNPを考慮する場合、かかるかかられる関係を判定してかかる側を優先
                //以下、新規追加のセンテンス判定

                storage.setItem(jsonFileName+"AnswerWithNewDictionaryHatsugen"+hatsugenNumber+"Sentence"+sentenceNumberInHatsugen, bun[hatsugenNumber][sentenceNumberInHatsugen]);
                storage.setItem(jsonFileName+"AnswerWithNewDictionaryHatsugen"+hatsugenNumber+"Sentence"+sentenceNumberInHatsugen+"LovePoint", RGB[hatsugenNumber][sentenceNumberInHatsugen][0]);
                storage.setItem(jsonFileName+"AnswerWithNewDictionaryHatsugen"+hatsugenNumber+"Sentence"+sentenceNumberInHatsugen+"WorkPoint", 0);
                storage.setItem(jsonFileName+"AnswerWithNewDictionaryHatsugen"+hatsugenNumber+"Sentence"+sentenceNumberInHatsugen+"FriendPoint", 0);

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

                //以上、新規追加のセンテンス判定

                if(hatsugenNumber%2==1){
                    kanjabun++;
                }else{
                    serapibun++;
                }
                if(bun[hatsugenNumber][sentenceNumberInHatsugen]=="Ａ"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="Ｂ"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="Ｔ"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="A"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="B"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="T"){
                    bun[hatsugenNumber][sentenceNumberInHatsugen]="";
                    continue;
                }
                if(bun[hatsugenNumber][sentenceNumberInHatsugen]!="Ａ"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="Ｂ"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="Ｔ"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="A"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="B"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="T"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!=""){
                    hatsugen[hatsugenNumber] += bun[hatsugenNumber][sentenceNumberInHatsugen];
                    hatsugen[hatsugenNumber] += "。";
                }

                if(wordNumberParsedInMorphologicalAnalysis==path.length){
                    if(hatsugenNumber%2==0 ){
                        if( sentenceNumberInHatsugen<=2 && tangosuu<=7){
                            RGBlist[hatsugenNumber/2][5]=1;
                        }
                    }
                    break;
                }
                if(path[wordNumberParsedInMorphologicalAnalysis].word_id=="2613630"||path[wordNumberParsedInMorphologicalAnalysis].basic_form=="："||path[wordNumberParsedInMorphologicalAnalysis].basic_form==":"||path[wordNumberParsedInMorphologicalAnalysis].surface_form=="･･･？："||path[wordNumberParsedInMorphologicalAnalysis].surface_form==")："||path[wordNumberParsedInMorphologicalAnalysis].surface_form.indexOf('〈') != -1||path[wordNumberParsedInMorphologicalAnalysis].surface_form.indexOf('〉') != -1){
                    if(hatsugenNumber%2==0 ){
                        if( sentenceNumberInHatsugen<=2 && tangosuu<=7){
                            RGBlist[hatsugenNumber/2][5]=1;
                        }
                    }
                    wordNumberParsedInMorphologicalAnalysis++;
                    break;
                }

                //以上、1文ごと
                wordNumberParsedInMorphologicalAnalysis++;
                sentenceNumberInHatsugen++;
            }

            //以上、1発言毎
            hatsugenNumber++;
        }

        var tango=[];
        x=0;
        for(hatsugenNumber=0;hatsugenNumber<keitaisokaiseki.length;++hatsugenNumber){
            for(i=0;i<keitaisokaiseki[hatsugenNumber].length;++i){
                for(j=0;j<keitaisokaiseki[hatsugenNumber][i].length;++j){
                    tango[x]=keitaisokaiseki[hatsugenNumber][i][j];
                    x++;
                }
            }
        }
        x=0;
        for(hatsugenNumber=0;hatsugenNumber<keitaisokaiseki.length;++hatsugenNumber){
            for(i=0;i<keitaisokaiseki[hatsugenNumber].length;++i){
                for(j=0;j<keitaisokaiseki[hatsugenNumber][i].length;++j){
                    y=0;
                    if(x>0){
                        for(z=0;z<x;z++){
                            if(tango[z]==keitaisokaiseki[hatsugenNumber][i][j]){
                                y=1;
                                break;
                            }
                        }
                    }
                    x++;
                    if(y==1){
                        continue;//次のjへ
                    }
                    tangoset.add(keitaisokaiseki[hatsugenNumber][i][j]);//tangoset終了
                }
            }
        }
        tangosett = Array.from(tangoset).map(function(t) {return {t};});

        for(i=0;i<tangosett.length;i++){
            miserables.nodes[i]=tangosett[i].t;
        }

        var graph;

        let isUsingDictionaryWithWord2Vec = 1;

        var sResult = select(jsonFileName,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,isUsingDictionaryWithWord2Vec);

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

        var vResult = setForViz(jsonFileName,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,isUsingDictionaryWithWord2Vec);//形態素解析後に1度目の描画
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
            setForViz(jsonFileName,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);
        };//graphの形状を切り替えた際もここで再描画される

        //graphのラジオボタン変わったらまた描画

        return{
            name:jsonFileName,RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2,ranshin:ranshin
        };

    });

    //以上、wordparseからパクった

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

    //の前にKNP判定

    var sResult = select(jsonFileName,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

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

    var vResult = setForViz(jsonFileName,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);//形態素解析後に1度目の描画
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
        setForViz(jsonFileName,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);
    };//graphの形状を切り替えた際もここで再描画される

    //graphのラジオボタン変わったらまた描画

    return{
        name:jsonFileName,RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2,ranshin:ranshin
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

export {AcceptDictionary};