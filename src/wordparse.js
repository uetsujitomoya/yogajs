import "kuromoji"

var funcReaderOnload = (event,keitaisokaiseki,checkboxlist,chboxlist,RGBlist) => {
  var data = JSON.parse(event.target.result);
  var h,i,j,k,l,m,n,c,r,g,b,x,y,z,bunsuu;  //mは段落
  var hinshi = [];
  var RGB = [];//どの発言にRGBが入っているか大まかに色分け
  var buntou;
  var toutencount;
  var toutenbasho=0;
  var tangoset = new Set();
  var tmp=[];
  var tangosett = [];
  var miserables={"nodes":[],"links":[]};
  var list = [];
  var target = document.getElementById("chbox");//checkboxを出す場所
  var checkboxRGB=[];

  kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
    const path = tokenizer.tokenize(data[0].a); //1集計単位ごとにこの関数を用いよう
    //console.log(path);
    n=0; //nは全データ内で何文字目か
    bunsuu=0; //全段落内で何分目か
    m=0; //何個目の発言か。これの偶奇わけで判断。カウンセラーが奇数。患者が偶数。1文は1文で格納
    while(n<path.length){//発言ごとのループ
      keitaisokaiseki[m] = []; //一発言
      hinshi[m] = [];
      RGB[m] = [];

      if(m%2==0){//カウンセラー
        RGBlist[m/2] = [0,0,0,0,0];
      }
      i=0; //段落内の何文目か。
      while(n<path.length){//文ごとのループ
        keitaisokaiseki[m][i] = []; //文
        hinshi[m][i]=[];
        keitaisokaiseki[m][i].length = 0;
        RGB[m][i] = [0,0,0];

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
    //console.log(keitaisokaiseki);
    for(m=0;m<keitaisokaiseki.length;++m){
      for(i=0;i<keitaisokaiseki[m].length;++i){
        tmp = keitaisokaiseki[m][i];
        if(keitaisokaiseki[m][i] ==false||keitaisokaiseki[m][i]==[]){
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
    tangosett = Array.from(tangoset).map(function(t) {
      return {t};
    });

    for(i=0;i<tangosett.length;i++){
      miserables.nodes[i]=tangosett[i].t;
    }

    //console.log(miserables.nodes);
    /*あとはlinksの作成だけ
    まずはlistをつくる*/

    //list作成

    for(k=0;k<miserables.nodes.length;k++){
      checkboxlist[k]=[0,0,0,0];
    }

    checkboxRGB[0]=[];
    checkboxRGB[1]=[];
    checkboxRGB[2]=[];

    c=0;
    r=0;
    b=0;
    g=0;

    //keitaisokaisekiとnodesを照らしあわせる
    for(m=0;m<keitaisokaiseki.length;++m){
      list[m] = [];
      for(i=0;i<keitaisokaiseki[m].length;++i){
        list[m][i] = [];
        for(j=0;j<keitaisokaiseki[m][i].length;++j){
          for(k=0;k<miserables.nodes.length;++k){
            if(keitaisokaiseki[m][i][j]==miserables.nodes[k].name){
              list[m][i][k]=1;
              if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=1){
                if(RGB[m][i][0]==1){
                  if(checkboxlist[k][1]==0){//単語とグループの組み合わせの重複を防ぐ

                    //checkboxに出す単語とグループの組み合わせ、さらにcheckedか否かの保存
                    //表形式に出力

                    if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉さん"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"||keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){
                      target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「愛」に。</label><br />";
                    }else{
                      target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「愛」に。</label><br />";
                    }
                    checkboxlist[k][0]=1;
                    checkboxlist[k][1]=1;
                    chboxlist[c]=[];
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
                    chboxlist[c]=[];
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
                    chboxlist[c]=[];
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
  })//kuromoji.builder終了
};

export {funcReaderOnload};