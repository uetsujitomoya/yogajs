/*あとはlinksの作成だけ
まずはlistをつくる*/

//list作成


var select =(checkboxlist,keitaisokaiseki,miserables,chboxlist,list,RGB) => {
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
								target.innerHTML += "<div id=\"" + c + "\">" + miserables.nodes[k] + "<br><label><input type=radio name=\"" + c + "\" value=0>どれにも含まない</div></label><br>";
								//その他の選択肢

								checkboxlist[k][0]=1;
								chboxlist[c]=[];
								chboxlist[c][0]=miserables.nodes[k];

								//checkboxに出す単語とグループの組み合わせ、さらにcheckedか否かの保存

								if(RGB[m][i][0]==1){
									checkboxlist[k][1]=2;
									chboxlist[c][1]=0;
									document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1 checked>「愛」に含む</label>";
								}else{
									document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1>「愛」に含む</label>";
								}
                  
								if(RGB[m][i][1]==1){
									document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2 checked>「交友」に含む</label>";
									chboxlist[c][1]=1;
								}else{
									document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2>「交友」に含む</label>";
								}
                  
								if(RGB[m][i][2]==1){
									document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked>「仕事」に含む</label>";
									chboxlist[c][1]=2;
								}else{
									document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3>「仕事」に含む</label>";
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

	/*
	
	<div id="hoge">
	<input type="radio" name="q1" value="hoge">
	<input type="radio" name="q1" value="foo">
	</div>
	
	候補単語自体について<div>とnameを追加
	候補グループについてvalueを追加
	
	*/


	if(c==0){
		var greet = document.createElement('p'),
		text = document.createTextNode('「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。');
		document.body.appendChild(greet).appendChild(text);
	}//DOMを操作してみよう「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。
}



export {select};
