/*あとはlinksの作成だけ
まずはlistをつくる*/

//list作成


var select =(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,list,RGB,RGBlist,hatsugen) => {
  var h,i,j,k,l,m,n;

  for(k=0;k<miserables.nodes.length;k++){
    checkboxlist[k]=[0,0,0,0,0];
  }

  var target = document.getElementById("radio_buttons");//checkboxを出す場所

  var c=0;

  //keitaisokaisekiとnodesを照らしあわせる
  for(m=0;m<keitaisokaiseki.length;++m){
    list[m] = [];
    for(i=0;i<keitaisokaiseki[m].length;++i){
      list[m][i] = [];
      for(j=0;j<keitaisokaiseki[m][i].length;++j){
        for(k=0;k<miserables.nodes.length;++k){
          if(keitaisokaiseki[m][i][j]==miserables.nodes[k]){
            list[m][i][k]=1;
            if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=1){

              if(checkboxlist[k][0]==0){

                //target.innerHTML += "<input id=\"ken" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k] + "」を「愛」に。</label><br />";

                c++;
                target.innerHTML += "<div id=\"" + c + "\">" + miserables.nodes[k] + "<br><label><input type=radio name=\"" + c + "\" value=0>どれにも含まない</label></div><br>";
                //その他の選択肢

                if(RGB[m][i][0]==1){
                  

                    //checkboxに出す単語とグループの組み合わせ、さらにcheckedか否かの保存

                    if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉さん"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"||keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){
                      checkboxlist[k][1]=2;
                      document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1 checked>「愛」に含む</label>";
                    }else{
                      document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1 checked>「愛」に含む</label>";
                    }
                    checkboxlist[k][0]=1;
                    chboxlist[c]=[];
                    chboxlist[c][0]=miserables.nodes[k];
                    chboxlist[c][1]=0;
                  
                }

                if(RGB[m][i][1]==1){
                  
                    if(keitaisokaiseki[m][i][j]=="友人"||keitaisokaiseki[m][i][j]=="親友"||keitaisokaiseki[m][i][j]=="友達"||keitaisokaiseki[m][i][j]=="友"||keitaisokaiseki[m][i][j]=="交友"||keitaisokaiseki[m][i][j]=="友好"){
                      document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2 checked>「交友」に含む</label>";
                    }else{
                      document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2 checked>「交友」に含む</label>";
                    }
                    checkboxlist[k][0]=1;

                    chboxlist[c]=[];
                    chboxlist[c][0]=miserables.nodes[k];
                    chboxlist[c][1]=1;
                  
                }
                if(RGB[m][i][2]==1){
                  
                    if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"){
                      document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked>「仕事」に含む</label>";
                    }else{
                      document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked>「仕事」に含む</label>";
                    }
                    checkboxlist[k][0]=1;
                    chboxlist[c]=[];
                    chboxlist[c][0]=miserables.nodes[k];
                    chboxlist[c][1]=2;
                  
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
  }

  if(c==0){
  	var greet = document.createElement('p'),
    text = document.createTextNode('「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。');
  	document.body.appendChild(greet).appendChild(text);
  }//DOMを操作してみよう「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。

  n=0;
  for(m=0;m<keitaisokaiseki.length;m=m+2){
  	c++;
  	target.innerHTML += "<div id=\"" + c + "\">" + hatsugen[m] + "<br><label><input type=radio name=\"" + c + "\" value=4 checked>閉じられた質問</label></div><br>";


  	if(RGBlist[m/2][3]=1){
  			document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked>開かれた質問</label>";
  		}else{
  			document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3>開かれた質問</label>";
  	}
  	if(RGBlist[m/2][5]=1){
  		document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=5 checked>その他（無駄話・相づち等）</label>";
  	}else{
  		document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=5>その他（無駄話・相づち等）</label>";
  	}

  	document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=4 checked>閉じられた質問</label>";
  		
  	chboxlist2[n]=c;
  	
  	n++;
  }

};



export {select};
