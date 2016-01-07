/* global kuromoji */
import {color, svg, force, width, height} from "./svg.js"
import "kuromoji"
var h,i,j,k,l,m,n,c,r,g,b,x,y,z,bunsuu;  //mは段落

document.getElementById('load-button').addEventListener('click', function () {
  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var data = JSON.parse(event.target.result);

    kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
      const path = tokenizer.tokenize(data[0].a); //1集計単位ごとにこの関数を用いよう
      console.log(path);

      var keitaisokaiseki = new Array; //このlengthは段落数
      var hinshi = new Array;
      var RGB = new Array;//どの発言にRGBが入っているか大まかに色分け
      var RGBlist  = new Array;//checkboxのセレクト結果

      var buntou;
      var tegakari;
      var toutencount;
      var toutenbasho=0;
      n=0; //nは全データ内で何文字目か
      bunsuu=0; //全段落内で何分目か
      m=0; //何個目の発言か。これの偶奇わけで判断。カウンセラーが奇数。患者が偶数。1文は1文で格納
      while(n<path.length){//発言ごとのループ
        keitaisokaiseki[m] = new Array; //一発言
        hinshi[m] = new Array;
        RGB[m] = new Array;

        if(m%2==0){//カウンセラー
          RGBlist[m/2] = new Array(5);
          RGBlist[m/2][0]=0;
          RGBlist[m/2][1]=0;
          RGBlist[m/2][2]=0;
          RGBlist[m/2][3]=0;
          RGBlist[m/2][4]=0;
        }
        i=0; //段落内の何文目か。
        while(n<path.length){//文ごとのループ
          keitaisokaiseki[m][i] = new Array; //文
          hinshi[m][i]=new Array;
          keitaisokaiseki[m][i].length = 0;
          RGB[m][i] = new Array(3);
          RGB[m][i][0]=0;
          RGB[m][i][1]=0;
          RGB[m][i][2]=0;

          j=0; //集計単位内で何単語目か
          while(n<path.length){//単語ごとのループ
            if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].word_id=="2613630"){
              bunsuu++;
              toutencount=0;
              break;//１文終了
            }
            if(path[n].pos_detail_1=="接尾"||path[n].basic_form=="*"||path[n].pos=="助詞"||path[n].basic_form=="、"||path[n].pos=="記号"||path[n].pos=="助動詞"||path[n].pos=="感動詞"||path[n].pos=="接頭詞"||path[n].pos_detail_1=="非自立"||path[n].basic_form=="する"||path[n].basic_form=="いる"||path[n].basic_form=="こういう"||path[n].basic_form=="そういう"||path[n].basic_form=="こう"||path[n].basic_form=="する"||path[n].basic_form=="こうした"||path[n].basic_form=="いう"||path[n].basic_form=="する"||path[n].basic_form=="なる"||path[n].basic_form=="その"||path[n].basic_form=="あの"||path[n].pos_detail_1=="数"||path[n].basic_form=="そう"||path[n].basic_form=="気持ち"||path[n].basic_form=="思い"||path[n].basic_form=="思う"||path[n].basic_form=="ある"){
              n++;//これないと延々ループする
              continue;
            }
            keitaisokaiseki[m][i][j] = path[n].basic_form;
            hinshi[m][i][j] = path[n];

            //ぐう期分け
            if(m%2==1){
              //患者（この発言rgbにがあることを示す）

              if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="主人"||keitaisokaiseki[m][i][j]=="父さん"||keitaisokaiseki[m][i][j]=="ご主人"||keitaisokaiseki[m][i][j]=="お父さん"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="姉さん"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"){

                RGB[m][i][0]=1;
              }
              if(keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

                RGB[m][i][0]=1;
              }
              if(keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){

                RGB[m][i][0]=1;
              }
              if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"||keitaisokaiseki[m][i][j]=="アルバイト"||keitaisokaiseki[m][i][j]=="働く"){
                RGB[m][i][2]=1;
              }

              if(keitaisokaiseki[m][i][j]=="友人"||keitaisokaiseki[m][i][j]=="親友"||keitaisokaiseki[m][i][j]=="友達"||keitaisokaiseki[m][i][j]=="友"||keitaisokaiseki[m][i][j]=="交友"||keitaisokaiseki[m][i][j]=="友好"){
                RGB[m][i][1]=1;
              }

            }else if(m%2==0){
              //カウンセラー

              if(keitaisokaiseki[m][i][j]=="いかが"||keitaisokaiseki[m][i][j]=="なんで"||keitaisokaiseki[m][i][j]=="どうして"||keitaisokaiseki[m][i][j]=="どの"||keitaisokaiseki[m][i][j]=="どのように"||keitaisokaiseki[m][i][j]=="いつ"||keitaisokaiseki[m][i][j]=="どういう"||keitaisokaiseki[m][i][j]=="どなた"||keitaisokaiseki[m][i][j]=="どう"||keitaisokaiseki[m][i][j]=="何"||keitaisokaiseki[m][i][j]=="何か"||keitaisokaiseki[m][i][j]=="どんな"||keitaisokaiseki[m][i][j]=="どのような"){

                RGBlist[m/2][3]=1;
                RGBlist[m/2][4]=0;
              }
            }
            n++;
            j++;
          }

          if(n==path.length){//確認
            break;
          }
          if(path[n].word_id=="2613630"){
            n++;
            break;
          }//1段落作成完了
          n++;
          i++;//段落内の何文目か
        }
        m++;
      }

      console.log(keitaisokaiseki);

      var tangoset = new Set();

      var tmp=new Array;

      for(m=0;m<keitaisokaiseki.length;++m){
        for(i=0;i<keitaisokaiseki[m].length;++i){
          tmp = keitaisokaiseki[m][i];
          if(keitaisokaiseki[m][i] ==false||keitaisokaiseki[m][i]==new Array){
            keitaisokaiseki[m][i].length=0;
            continue;
          }
          for(j=0;j<tmp.length;++j){
            tangoset.add({name:keitaisokaiseki[m][i][j],
              group:0
            });//tangoset終了
          }
        }
      }

      var tangosett = new Array;;

      tangosett = Array.from(tangoset).map(function(t) {
        return {t};
      });

      var miserables={"nodes":new Array,"links":new Array};

      for(i=0;i<tangosett.length;i++){
        miserables.nodes[i]=tangosett[i].t;
      }

      console.log(miserables.nodes);

      /*あとはlinksの作成だけ
      まずはlistをつくる*/
      var list = new Array(keitaisokaiseki.length);
      //list作成

      var checkboxlist=new Array(miserables.nodes.length);//checkboxに入る単語に1+RGBどれかの情報が3次元
      for(k=0;k<miserables.nodes.length;k++){
        checkboxlist[k]=new Array;
        checkboxlist[k][0]=0;
        checkboxlist[k][1]=0;
        checkboxlist[k][2]=0;
        checkboxlist[k][3]=0;
      }
      var checkboxRGB=new Array(3);
      checkboxRGB[0]=new Array;
      checkboxRGB[1]=new Array;
      checkboxRGB[2]=new Array;

      var chboxlist=new Array;//通し番号

      c=0;
      r=0;
      b=0;
      g=0;

      var target = document.getElementById("chbox");//checkboxを出す場所

      //keitaisokaisekiとnodesを照らしあわせる
      for(m=0;m<keitaisokaiseki.length;++m){
        list[m] = new Array(keitaisokaiseki[m].length);
        for(i=0;i<keitaisokaiseki[m].length;++i){
          list[m][i] = new Array(miserables.nodes.length);
          for(j=0;j<keitaisokaiseki[m][i].length;++j){
            for(k=0;k<miserables.nodes.length;++k){
              if(keitaisokaiseki[m][i][j]==miserables.nodes[k].name){
                list[m][i][k]=1;
                if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=1){
                  if(RGB[m][i][0]==1){
                    if(checkboxlist[k][1]==0){//単語とグループの組み合わせの重複を防ぐ
                      if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉さん"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"||keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){
                        target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「愛」に。</label><br />";
                      }else{
                        target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「愛」に。</label><br />";
                      }
                      checkboxlist[k][0]=1;
                      checkboxlist[k][1]=1;
                      chboxlist[c]=new Array(2);
                      chboxlist[c][0]=miserables.nodes[k].name;
                      chboxlist[c][1]=0;
                      c++;
                    }
                  }

                  if(RGB[m][i][1]==1){
                    if(checkboxlist[k][2]==0){
                      if(keitaisokaiseki[m][i][j]=="友人"||keitaisokaiseki[m][i][j]=="親友"||keitaisokaiseki[m][i][j]=="友達"||keitaisokaiseki[m][i][j]=="友"||keitaisokaiseki[m][i][j]=="交友"||keitaisokaiseki[m][i][j]=="友好"){
                        target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「交友」に。</label><br />";
                      }else{
                        target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「交友」に。</label><br />";
                      }
                      checkboxlist[k][0]=1;
                      checkboxlist[k][2]=1;
                      chboxlist[c]=new Array(2);
                      chboxlist[c][0]=miserables.nodes[k].name;
                      chboxlist[c][1]=1;
                      c++;
                    }
                  }
                  if(RGB[m][i][2]==1){
                    if(checkboxlist[k][3]==0){
                      if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"){
                        target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「仕事」に。</label><br />";
                      }else{
                        target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「仕事」に。</label><br />";
                      }
                      checkboxlist[k][0]=1;
                      checkboxlist[k][3]=1;
                      chboxlist[c]=new Array(2);
                      chboxlist[c][0]=miserables.nodes[k].name;
                      chboxlist[c][1]=2;
                      c++;
                    }
                  }
                  if(checkboxlist[k][1]+checkboxlist[k][2]+checkboxlist[k][3]>=0){
                    break;//miserables実は重複してる
                  }
                }
              }
            }
          }
        }
      }

      if(c==0){
        var greet = document.createElement('p'),
        text = document.createTextNode('「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。');
        document.body.appendChild(greet).appendChild(text);
      }//DOMを操作してみよう「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。


      //これか。

      document.getElementById('check-button').addEventListener('click', function () {
        console.log("手順2に進んだよ")
        var checked = new Array(chboxlist.length);

        for(c=0 ; c<chboxlist.length ; c++){    //"ken"に1～5の連番付き
        var obj = eval("document.form1.ken" + c);  //checkboxｵﾌﾞｼﾞｪｸﾄを生成する
        if(obj.checked)	{
          checked[c] =1;
        }else{
          checked[c]=0;
        }
      }
      console.log(checked);

      //check配列でonの単語について、文を舐めてRGBlistをつくる。

      //偶奇1setでカウント（同じm内に収める）

      m=0;//発言数
      n=0;//偶奇1setのセット数
      while(m<keitaisokaiseki.length){//発言ごとのループ

        //まずは偶数から（カウンセラー）
        //iは発言内の何文目か。
        for(i=0;i<keitaisokaiseki[m].length;i++){
          j=0; //集計単位内で何単語目か
          for(j=0;j<keitaisokaiseki[m][i].length;j++){//単語ごとのループ
            for(c=0;c<checkboxlist.length;c++){
              if (checked[c]==1) {
                if(keitaisokaiseki[m][i][j]==chboxlist[c][0]){
                  if(chboxlist[c][1]==0){
                    RGBlist[n][0]=RGBlist[n][0]+1;
                  }else if(chboxlist[c][1]==1){
                    RGBlist[n][1]=RGBlist[n][1]+1;
                  }else if(chboxlist[c][1]==2){
                    RGBlist[n][2]=RGBlist[n][2]+1;
                  }
                }
              }
            }
          }
        }

        m++;

        //奇数（患者）

        console.log(RGBlist[n]);
        m++;
        n++;
      }

      var color2=new Array();
      for(m=0;m<keitaisokaiseki.length/2;m++){
        if(RGBlist[m][3]>=1){

          color2[m]="#d4d";

        }else{
          color2[m]="gray";
        }
      }
      console.log(color2);

      var stackdataArr = new Array(3);
      for(h=0;h<3;h++){
        stackdataArr[h] = new Array();
        for(m=0;m<((keitaisokaiseki.length-1)/2);m++){//2個飛ばしにしたら後が面倒くさい。患者 1→0　3→1 長さ9なら番号は8まで
          stackdataArr[h][m]=new Object();
          stackdataArr[h][m]= {x:m+1,y:(28*(RGBlist[m][h])/(keitaisokaiseki[2*m+1].length))};
          console.log(stackdataArr[h][m]);
        }
      }

      var stack = d3.layout.stack()
      .x(function(d){return 1;})
      .y(function(d){return d.y;})
      .values(function(d){return d;});
      var stackdata = stack(stackdataArr);
      var max = d3.max(stackdata[stackdata.length-1], function(d){return d.y + d.y0;});
      var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
      var scaleY = d3.scale.linear().domain([0,max]).range([0,height]);
      var colors = ["#7777ff","#77ff77","#ff7777"];

      var area = d3.svg.area()
      .x(function(d,i){return (i+1) * width/color2.length})
      .y0(function(d){return height})
      .y1(function(d){return height - scaleY(d.y+d.y0)});
      svg.selectAll("path")
      .data(stackdata.reverse())
      .enter()
      .append("path")
      .attr("d", area)
      .attr("fill",function(d,i){return colors[i]});

      //奇数発言目
      //grid line
      //引数はstart,stop,stepの順
      //[190,170,150,130,110,90,70,50,30,10]と同等
      var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
      svg.selectAll("line.v")
      .data(range).enter().append("line")
      .attr("x1", function(d,i){return d;}).attr("y1", 0)
      .attr("x2", function(d,i){return d;}).attr("y2", height);
      svg.selectAll("line")
      .attr("stroke", function(d,i){return color2[color2.length-1-i]})
      .attr("stroke-width", 3)
    });
    //checkbox依存部分終わり
  })//kuromoji.builder終了
};//reader.onload終了。これとなんちゃら(file)が並列してないといけない
reader.readAsText(file);
});//document.getElementById終了
