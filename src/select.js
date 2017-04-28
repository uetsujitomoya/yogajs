//入れ替える点の入力（トースト）

/*
 let Button= {
 html:"",
 orijinalSentence:""
 };*/

import {convertCSV2Storage} from "./convertCSV2Storage.js";

let ButtonPart=()=>{
    let Button=(orijinalSentence, task)=>{
        this.orijinalSentence = orijinalSentence;
        this.task = task;
        this.html = "";
        this.storageName="";
    };

    let ButtonRow;

    let ButtonArray=[];
    ButtonArray[0] = new Button(orijinalSentence, task);

};



let createGraphSelectButton=()=>{
    let GraphSelectButtonPlaceID = "GraphSelectButton";
    let stackedChartName = "積み重ねグラフ";
    let barChartName = "帯グラフ";
    let target = document.getElementById(GraphSelectButtonPlaceID);//checkboxを出す場所
    target.innerHTML += "<div id=\"graph\" style=\"cursor: pointer\"></div><br>";
    document.getElementById("graph").innerHTML += "<label><input type=radio name=\"graph\" value=11>" + stackedChartName + "</label>";
    //document.getElementById("graph").innerHTML += "<label><input type=radio name=\"graph\" value=12>graph2</label>";
    document.getElementById("graph").innerHTML += "<label><input type=radio name=\"graph\" value=13>" + barChartName + "</label>";
};

let makeRGB=(RGB,hatsugen)=>{
    let loveNumber=0;
    let workNumber=1;
    let friendNumber=2;
    let noClassNumber=3;

    for(let hatsugenNumber=1;hatsugenNumber<hatsugen.length;hatsugenNumber=hatsugenNumber+2){
        RGB[hatsugenNumber]=[];
        console.log(hatsugen[hatsugenNumber]);
        hatsugen[hatsugenNumber].sentence.forEach((sentenceNumber)=>{
            RGB[hatsugenNumber][sentenceNumber]=[0,0,0,0];
            if(hatsugen[hatsugenNumber].sentences[sentenceNumber].task=="love"){
                RGB[hatsugenNumber][sentenceNumber][loveNumber]=1;
            }else if(hatsugen[hatsugenNumber].sentences[sentenceNumber].task=="work"){
                RGB[hatsugenNumber][sentenceNumber][workNumber]=1;
            }else if(hatsugen[hatsugenNumber].sentences[sentenceNumber].task=="friend"){
                RGB[hatsugenNumber][sentenceNumber][friendNumber]=1;
            }else{
                RGB[hatsugenNumber][sentenceNumber][noClassNumber]=1;
            }
        });
    }
};




var select =(jsonName,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) => {
    console.log("entered select.js");

    console.log("jsonName");
    console.log(jsonName);

    convertCSV2Storage(jsonName,storage);


  /*
   if(isUsingKNP==1){
   createSelectPartWithKNP();
   return{
   checkboxlist:checkboxlist,
   chboxlist:chboxlist,
   chboxlist2:chboxlist2,
   RGB:RGB,
   RGBlist:RGBlist,
   checked:checked,
   checked2:checked2,
   taiou:taiou,
   taiou2:taiou2,
   chboxlength:chboxlength,
   chboxlength2:chboxlength2
   };
   }
   */
  //let RGB=[];

    //makeRGB(RGB,hatsugen);

    /*if(isUsingDictionaryWithWord2Vec==1){
        console.log("isUsingDictionaryWithWord2Vec==1");
    }*/

    var i,m,n,f;
    taiou = [];
    taiou2=[];

    var target = document.getElementById("radio_buttons");//checkboxを出す場所

    var answerNumber=0;
    n=0;
    chboxlength=0;
    chboxlength2=0;
    var questionNumber=0;

    createGraphSelectButton();

    for(m=0;m<keitaisokaiseki.length;m++){
        console.log("RGB[%d]",m);
        console.log(RGB[m]);
        if(m%2==1){
            for(i=0;i<keitaisokaiseki[m].length;++i){
                if(bun[m][i]=="Ａ"||bun[m][i]=="Ｂ"||bun[m][i]=="Ｔ"||bun[m][i]=="A"||bun[m][i]=="B"||bun[m][i]=="T"||bun[m][i]==""){
                    continue;
                }
                n++;
                chboxlist[n]=[];//こいつの長さは、チェックボックスの有無にかかわらず全文数なので、ifの外
                chboxlist[n][0]=bun[m][i];
                chboxlist[n][1]=0;

                answerNumber++;
                chboxlength++;

/*
                if(isUsingDictionaryWithWord2Vec==1){
                    var stockedAnswerGroupNumber =storage.getItem(name+"AnswerWithNewDictionary"+c);
                    //今後辞書ネームにも対応
                }else if(isUsingKNP==1){

                }else{*/
                    let stockedAnswerGroupNumber =storage.getItem(jsonName+"RGB"+answerNumber);
                  /*
                }
                */

                if(stockedAnswerGroupNumber!=null){
                    RGB[m][i][stockedAnswerGroupNumber]=1;
                    for(f=0;f<=2;f++){
                        if(f!=stockedAnswerGroupNumber){
                            RGB[m][i][f]=0;
                        }//全てゼロなら濃いグレーが出力
                    }
                }

                //console.log("RGB[%d][%d]",m,i);
                //console.log(RGB[m][i]);//RGBが作られていない→分類別に対応。170315

                console.log("RGB[%d][%d]",m,i);
                console.log(RGB[m][i]);
                taiou[answerNumber-1]=n-1;
                console.log("c=%d,n=%d,m=%d,i=%d",answerNumber,n,m,i);
                if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=2){
                    target.innerHTML += "<div id=\"b" + answerNumber + "\" style=\"cursor: pointer\"><u>" + (m+1) + "(C) " + bun[m][i] + "</u></div><div id=\"r" + answerNumber + "\"><label><input type=radio name=\"r" + answerNumber + "\" value=0>どれにも含まない</label></div><br>";

                }else{
                    target.innerHTML += "<div id=\"b" + answerNumber + "\" style=\"cursor: pointer\"><font size=2><u>" + (m+1) + "(C) " + bun[m][i] + "</u></div><div id=\"r" + answerNumber + "\" class=\"hide\"<label><input type=radio name=\"r" + answerNumber + "\" value=0>どれにも含まない</label></div></font><br>";
                }

                if(RGB[m][i][0]!=0){
                    chboxlist[n][1]=0;
                    document.getElementById("r"+answerNumber).innerHTML += "<label><input type=radio name=\"r" + answerNumber + "\" value=1 checked><font color=\"#ff7777\">【</font>「愛」に含む<font color=\"#ff7777\">】</font></label>";
                }else{
                    document.getElementById("r"+answerNumber).innerHTML += "<label><input type=radio name=\"r" + answerNumber + "\" value=1><font color=\"#ff7777\">【</font>「愛」に含む<font color=\"#ff7777\">】</font></label>";
                }
                if(RGB[m][i][1]!=0){
                    document.getElementById("r"+answerNumber).innerHTML += "<label><input type=radio name=\"r" + answerNumber + "\" value=2 checked><font color=\"#77ff77\">【</font>「交友」に含む<font color=\"#77ff77\">】</font></label>";
                    chboxlist[n][1]=1;
                }else{
                    document.getElementById("r"+answerNumber).innerHTML += "<label><input type=radio name=\"r" + answerNumber + "\" value=2><font color=\"#77ff77\">【</font>「交友」に含む<font color=\"#77ff77\">】</font></label>";
                }
                if(RGB[m][i][2]!=0){
                    document.getElementById("r"+answerNumber).innerHTML += "<label><input type=radio name=\"r" + answerNumber + "\" value=3 checked><font color=\"#7777ff\">【</font>「仕事」に含む<font color=\"#7777ff\">】</font></label>";
                    chboxlist[n][1]=2;
                }else{
                    document.getElementById("r"+answerNumber).innerHTML += "<label><input type=radio name=\"r" + answerNumber + "\" value=3><font color=\"#7777ff\">【</font>「仕事」に含む<font color=\"#7777ff\">】</font></label>";
                }
            }
        }else{
            console.log("セラピストの質問");
            questionNumber++;
            chboxlength2++;
            chboxlist2[questionNumber]=[];
            chboxlist2[questionNumber][0]=hatsugen[m];
            chboxlist2[questionNumber][1]=4;
            taiou2[questionNumber-1]=questionNumber-1;

            var stockedQuestionGroupNumber =storage.getItem(jsonName+"RGBlist"+questionNumber);
            console.log("s=%d,stockedQuestionGroupNumber=%s",questionNumber,stockedQuestionGroupNumber);

            if(stockedQuestionGroupNumber!=null){

                for(f=3;f<=7;f++){
                    if(f==stockedQuestionGroupNumber){
                        RGBlist[m/2][f]=1;
                    }else{
                        RGBlist[m/2][f]=0;
                    }
                }
            }

            console.log("RGBlist[%d]",m/2);
            console.log(RGBlist[m/2]);

            if(RGBlist[m/2][3]==1){
                target.innerHTML += "<div id=\"bs" + questionNumber + "\" style=\"cursor: pointer\"><font size=2 color=dimgray><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></font></div><div id=\"rs" + questionNumber + "\" class=\"hide\"><label><input type=radio name=\"rs" + questionNumber + "\" value=3 checked><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"rs"
                    + questionNumber + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=7><font color=black>世間話</font></label></div><br>";
            }else	if(RGBlist[m/2][5]==1){
                target.innerHTML += "<div id=\"bs" + questionNumber + "\" style=\"cursor: pointer\"><font size=2 color=dimgray><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></font></div><div id=\"rs" + questionNumber + "\" class=\"hide\"><label><input type=radio name=\"rs" + questionNumber + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=5 checked><font color=purple>相づち</font></label><label><input type=radio name=\"rs"
                    + questionNumber + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=7><font color=black>世間話</font></label></div><br>";
            }else	if(RGBlist[m/2][4]==1){
                target.innerHTML += "<div id=\"bs" + questionNumber + "\" style=\"cursor: pointer\"><font size=2 color=dimgray><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></font></div><div id=\"rs" + questionNumber + "\" class=\"hide\"><label><input type=radio name=\"rs" + questionNumber + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=4 checked><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"rs"
                    + questionNumber + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=7><font color=black>世間話</font></label></div><br>";
            }else	if(RGBlist[m/2][6]==1){
                target.innerHTML += "<div id=\"bs" + questionNumber + "\" style=\"cursor: pointer\"><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></div><div id=\"rs" + questionNumber + "\"><label><input type=radio name=\"rs" + questionNumber + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"rs" + questionNumber
                    + "\" value=6 checked><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=7><font color=black>世間話</font></label></div><br>";
            }else{
                target.innerHTML += "<div id=\"bs" + questionNumber + "\" style=\"cursor: pointer\"><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></div><div id=\"rs" + questionNumber + "\"><label><input type=radio name=\"rs" + questionNumber + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"rs" + questionNumber
                    + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + questionNumber + "\" value=7 checked><font color=black>世間話</font></label></div><br>";
            }
        }
    }

    console.log("%c radio_buttons and grapheselectbutton",'color:red');
    console.log(document.getElementById('radio_buttons'));
    console.log(document.getElementById('GraphSelectButton'));

    return{
        checkboxlist:checkboxlist,
        chboxlist:chboxlist,
        chboxlist2:chboxlist2,
        RGB:RGB,
        RGBlist:RGBlist,
        checked:checked,
        checked2:checked2,
        taiou:taiou,
        taiou2:taiou2,
        chboxlength:chboxlength,
        chboxlength2:chboxlength2
    };

};
export {select};
