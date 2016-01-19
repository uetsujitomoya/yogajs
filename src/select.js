var select =(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,bunCheckedTaiou,chboxlength,chboxlength2) => {
/*
	console.log(taiou)
	taiou = [];
	bunCheckedTaiou = [];
	checked=[];
	checked2=[];
	*/
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
				chboxlist[n]=[];//こいつの長さは、チェックボックスの有無にかかわらず全文数
				chboxlist[n][0]=bun[m][i];
				taiou[c-1]=n-1;
				target.innerHTML += "<div id=\"" + c + "\">" + bun[m][i] + "<br>（" + hatsugen[m] + "）<br><label><input type=radio name=\"" + c + "\" value=0>どれにも含まない</div></label><br>";
				//その他の選択肢

				//checkboxに出す単語とグループの組み合わせ、さらにcheckedか否かの保存
				if(RGB[m][i][0]==1){
					chboxlist[n][1]=0;
					document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1 checked><font color=\"#ff7777\">「愛」に含む</font></label>";
				}
				if(RGB[m][i][1]==1){
					document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2 checked><font color=\"#77ff77\">「交友」に含む</font></label>";
					chboxlist[n][1]=1;
				}
				if(RGB[m][i][2]==1){
					document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked><font color=\"#7777ff\">「仕事」に含む</font></label>";
					chboxlist[n][1]=2;
				}
				//if(checkboxlist[k][1]+checkboxlist[k][2]+checkboxlist[k][3]>=0){
				//break;//miserables実は重複してる
				//}

			}else if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]==1){
				n++;
				chboxlist[n]=[];//こいつの長さは、チェックボックスの有無にかかわらず全文数
				chboxlist[n][0]=bun[m][i];
				if(RGB[m][i][0]==1){
					checked[n-1]=1;
				}

				if(RGB[m][i][1]==1){
					checked[n-1]=2;
				}

				if(RGB[m][i][2]==1){
					checked[n-1]=3;
				}
			}//RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]==1終了
			//}//checkboxlist[k][0]==0
			//}//keitaisokaiseki[m][i][j]==miserables.nodes[k]
			//}
		}
	}

	if(n==0){
		var greet = document.createElement('p'),
		text = document.createTextNode('「愛」「交友」「仕事」のいずれかに該当しそうな文が一つも見つかりませんでした。');
		document.body.appendChild(greet).appendChild(text);
	}else if(c==0){
		var greet = document.createElement('p'),
		text = document.createTextNode('「愛」「交友」「仕事」のいずれか複数に該当しそうな文が一つも見つかりませんでした。');
		document.body.appendChild(greet).appendChild(text);
	}//DOMを操作してみよう「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。

	console.log("checked");
	console.log(checked);
	chboxlength=c;

	console.log("keitaisokaiseki");
	console.log(keitaisokaiseki.length);

	//console.log("RGBlist");
	//console.log(RGBlist);
	n=0;

	for(m=0;m<keitaisokaiseki.length;m=m+2){


		n++;

		chboxlist2[n]=[];
		chboxlist2[n][0]=hatsugen[m];
		chboxlist2[n][1]=4;

		if(RGBlist[m/2][3]==1){
			console.log("「%s」は開かれた質問だと思います",hatsugen[m]);
			checked2[n-1]=3;
		}else	if(RGBlist[m/2][5]==1){
			console.log("「%s」は相づちだと思います",hatsugen[m]);
			checked2[n-1]=5;
		}else	if(RGBlist[m/2][4]==1){
			console.log("「%s」は閉じられた質問だと思います",hatsugen[m]);
			c++;
			taiou[c-1]=n-1;
			target.innerHTML += "<div id=\"" + c + "\">" + hatsugen[m] + "<br><label><input type=radio name=\"" + c + "\" value=4 checked>閉じられた質問</label><label><input type=radio name=\"" + c + "\" value=6>解釈</label><label><input type=radio name=\"" + c + "\" value=7>無駄話</label></div><br>";
		}else{
			console.log("「%s」は何？",hatsugen[m]);
			c++;
			taiou[c-1]=n-1;
			target.innerHTML += "<div id=\"" + c + "\">" + hatsugen[m] + "<br><label><input type=radio name=\"" + c + "\" value=4>閉じられた質問</label><label><input type=radio name=\"" + c + "\" value=6>解釈</label><label><input type=radio name=\"" + c + "\" value=7 checked>無駄話</label></div><br>";
		}
	}//m=0;m<keitaisokaiseki.length;m=m+2
	console.log("checked2");
	console.log(checked2);
	chboxlength2 = c -chboxlength;
	console.log("chboxlength2=%d",chboxlength2);

	return{
		checkboxlist:checkboxlist,
		chboxlist:chboxlist,
		chboxlist2:chboxlist2,
		RGB:RGB,
		RGBlist:RGBlist,
		checked:checked,
		checked2:checked2,
		taiou:taiou,
		chboxlength:chboxlength,
		chboxlength2:chboxlength2,
		bunCheckedTaiou:bunCheckedTaiou
	}
}

export {select};
