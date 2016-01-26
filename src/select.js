var select =(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2) => {

	var h,i,j,k,l,m,n;
	taiou = [];

	var target = document.getElementById("radio_buttons");//checkboxを出す場所

	var c=0;
	n=0;

	//keitaisokaisekiとnodesを照らしあわせる
	var btn=[];
	//患者ごと
	for(m=1;m<keitaisokaiseki.length;m=m+2){
		//list[m] = [];
		var RGBtensuu=[0,0,0];
		for(i=0;i<keitaisokaiseki[m].length;++i){
			n++;
			chboxlist[n]=[];//こいつの長さは、チェックボックスの有無にかかわらず全文数なので、ifの外
			chboxlist[n][0]=bun[m][i];
			chboxlist[n][1]=0;

			c++;

			taiou[c-1]=n-1;
			if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=2){
				target.innerHTML += "<div id=\"b" + c + "\">"+ bun[m][i] + "</div><div id=\"" + c + "\"><br><font size=1 color=silver>（" + (m+1) + " " + hatsugen[m] + "）</font><br><label><input type=radio name=\"" + c + "\" value=0>どれにも含まない</label></div>";

			}else{
				target.innerHTML += "<div id=\"b" + c + "\"><font size=1>"+ bun[m][i] + "</div><div id=\"" + c + "\" class=\"hide\"><br><font size=1 color=silver>（" + (m+1) + " " + hatsugen[m] + "）</font><br><label><input type=radio name=\"" + c + "\" value=0>どれにも含まない</label></div></font>";
			}


			if(RGB[m][i][0]==1){
				chboxlist[n][1]=0;
				document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1 checked><font color=\"#ff7777\">「愛」に含む</font></label>";
			}else{
				document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=1><font color=\"#ff7777\">「愛」に含む</font></label>";
			}
			if(RGB[m][i][1]==1){
				document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2 checked><font color=\"#77ff77\">「交友」に含む</font></label>";
				chboxlist[n][1]=1;
			}else{
				document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=2><font color=\"#77ff77\">「交友」に含む</font></label>";
			}
			if(RGB[m][i][2]==1){
				document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3 checked><font color=\"#7777ff\">「仕事」に含む</font></label>";
				chboxlist[n][1]=2;
			}else{
				document.getElementById(c).innerHTML += "<label><input type=radio name=\"" + c + "\" value=3><font color=\"#7777ff\">「仕事」に含む</font></label>";
			}
			console.log(document.getElementById(c).classList);
			console.log(document.getElementById("b"+c));
			

		}
	}

	if(n==0){
		target.innerHTML +="「愛」「交友」「仕事」のいずれかに該当しそうな文が一つも見つかりませんでした。<br>";
	}else if(c==0){
		target.innerHTML +="「愛」「交友」「仕事」のいずれか複数に該当しそうな文が一つも見つかりませんでした。<br>";
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
			checked2[n-1]=4;
		}else	if(RGBlist[m/2][6]==1){
			console.log("「%s」は解釈だと思います",hatsugen[m]);
			c++;
			taiou[c-1]=n-1;
			target.innerHTML += "--<br><div id=\"" + c + "\">" + (m+1) + " "  + hatsugen[m] + "<br><label><input type=radio name=\"" + c + "\" value=6 checked>解釈</label><label><input type=radio name=\"" + c + "\" value=7>無駄話</label></div><br>";
		}else{
			console.log("「%s」は無駄話だと思います",hatsugen[m]);
			c++;
			taiou[c-1]=n-1;
			target.innerHTML += "--<br><div id=\"" + c + "\">" + (m+1) + " "   + hatsugen[m] + "<br><label><input type=radio name=\"" + c + "\" value=6>解釈</label><label><input type=radio name=\"" + c + "\" value=7 checked>無駄話</label></div><br>";
		}
	}//m=0;m<keitaisokaiseki.length;m=m+2

	if(c==chboxlength){
		target.innerHTML +="「解釈」「無駄話」のいずれかに該当しそうなカウンセラーの発言が一つも見つかりませんでした。";
	}

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
		chboxlength2:chboxlength2
	}
}

/*<div id="items">
<div id='item1' class="hide">
radio
<ul>
<li>check1</li>
<li>check2</li>
</ul>
</div>
</div>

<div>
<button id="btn">
show hide
</button>
</div>ji*/

export {select};
