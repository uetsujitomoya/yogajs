var select =(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,list,RGB,RGBlist,hatsugen,bun,checked) => {
	var h,i,j,k,l,m,n;

	//for(k=0;k<miserables.nodes.length;k++){
	//checkboxlist[k]=[0,0,0,0,0];
	//}

	var target = document.getElementById("radio_buttons");//checkboxを出す場所

	var c=0;
	n=0;

	//keitaisokaisekiとnodesを照らしあわせる
	for(m=0;m<keitaisokaiseki.length;++m){
		//list[m] = [];
		var RGBtensuu=[0,0,0];
		for(i=0;i<keitaisokaiseki[m].length;++i){
			//list[m][i] = [];
			//for(k=0;k<miserables.nodes.length;++k){
			//if(keitaisokaiseki[m][i][j]==miserables.nodes[k]){
			//list[m][i][k]=1;
			//if(checkboxlist[k][0]==0){
			//checkboxlist[k][0]=1;
			if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=2){
				c++;
				n++;
				target.innerHTML += "<div id=\"" + c + "\">" + miserables.nodes[k] + "<br><label><input type=radio name=\"" + c + "\" value=0>どれにも含まない</div></label><br>";
				//その他の選択肢
				chboxlist[c]=[];
				chboxlist[c][0]=miserables.nodes[k];
				//checkboxに出す単語とグループの組み合わせ、さらにcheckedか否かの保存
				if(RGB[m][i][0]==1){
					chboxlist[c][1]=0;
					document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1 checked><font color=\"#ff7777\">「愛」に含む</font></label>";
				}
				if(RGB[m][i][1]==1){
					document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2 checked><font color=\"#77ff77\">「交友」に含む</font></label>";
					chboxlist[c][1]=1;
				}
				if(RGB[m][i][2]==1){
					document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked><font color=\"#7777ff\">「仕事」に含む</font></label>";
					chboxlist[c][1]=2;
				}
				//if(checkboxlist[k][1]+checkboxlist[k][2]+checkboxlist[k][3]>=0){
				//break;//miserables実は重複してる
				//}

			}else if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]==1){
				n++;
				if(RGB[m][i][0]==1){
					checked[n]==1;
				}

				if(RGB[m][i][1]==1){
					checked[n]==2;
				}

				if(RGB[m][i][2]==1){
					checked[n]==3;
				}
			}//RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]==1終了
			//}//checkboxlist[k][0]==0
			//}//keitaisokaiseki[m][i][j]==miserables.nodes[k]
			//}
		}
	}

	if(n==0){
		var greet = document.createElement('p'),
		text = document.createTextNode('「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。');
		document.body.appendChild(greet).appendChild(text);
	}//DOMを操作してみよう「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。

	console.log("keitaisokaiseki");
	console.log(keitaisokaiseki.length);

	//console.log("RGBlist");
	//console.log(RGBlist);

	for(m=0;m<keitaisokaiseki.length;m=m+2){

		c++;
		n=c-chboxlist.length;
		target.innerHTML += "<div id=\"" + c + "\">" + hatsugen[m] + "<br></div><br>";

		chboxlist2[n]=[];
		chboxlist2[n][0]=hatsugen[m];
		chboxlist2[n][1]=4;

		if(RGBlist[m/2][5]==1){
			chboxlist2[n][1]=3;
			console.log("「%s」は開かれた質問だと思います",hatsugen[m]);
			document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=5 checked><font color=\"silver\"><u>無駄話・相づち等</u></font></label>";
		}else	if(RGBlist[m/2][3]==1){
			console.log("「%s」はその他だと思います",hatsugen[m]);
			document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked><font color=\"#d4d\">開かれた質問</font></label>";
			chboxlist2[n][1]=5;
		}else{
			document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3>開かれた質問</label>";
		}

		document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=4>閉じられた質問</label>";

	}
	console.log("chboxlist2");
	console.log(chboxlist2);
}

export {select};
