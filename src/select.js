var select =(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2) => {

	var h,i,j,k,l,m,n;
	taiou = [];

	var target = document.getElementById("radio_buttons");//checkboxを出す場所

	var c=0;
	n=0;
	var btn=[];
	for(m=1;m<keitaisokaiseki.length;m=m+2){
		//list[m] = [];
		var RGBtensuu=[0,0,0];
		for(i=0;i<keitaisokaiseki[m].length;++i){
			if(bun[m][i]=="Ａ"||bun[m][i]=="Ｂ"||bun[m][i]=="Ｔ"||bun[m][i]=="A"||bun[m][i]=="B"||bun[m][i]=="T"||bun[m][i]==""){
				continue;
			}
			n++;
			chboxlist[n]=[];//こいつの長さは、チェックボックスの有無にかかわらず全文数なので、ifの外
			chboxlist[n][0]=bun[m][i];
			chboxlist[n][1]=0;

			c++;

			taiou[c-1]=n-1;
			if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=2){
				target.innerHTML += "<div id=\"b" + c + "\">"+ bun[m][i] + "</div><div id=\"r" + c + "\"><font size=1 color=yellow>（" + (m+1) + " " + hatsugen[m] + "）</font><label><input type=radio name=\"r" + c + "\" value=0>どれにも含まない</label></div><br>";

			}else{
				target.innerHTML += "<div id=\"b" + c + "\"><font size=1 color=gray>"+ bun[m][i] + "</div><div id=\"r" + c + "\" class=\"hide\"><font size=1 color=yellow>（" + (m+1) + " " + hatsugen[m] + "）</font><label><input type=radio name=\"r" + c + "\" value=0>どれにも含まない</label></div></font><br>";
			}

			if(RGB[m][i][0]==1){
				chboxlist[n][1]=0;
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=1 checked><font color=\"#ff7777\">「愛」に含む</font></label>";
			}else{
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=1><font color=\"#ff7777\">「愛」に含む</font></label>";
			}
			if(RGB[m][i][1]==1){
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=2 checked><font color=\"#77ff77\">「交友」に含む</font></label>";
				chboxlist[n][1]=1;
			}else{
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=2><font color=\"#77ff77\">「交友」に含む</font></label>";
			}
			if(RGB[m][i][2]==1){
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=3 checked><font color=\"#7777ff\">「仕事」に含む</font></label>";
				chboxlist[n][1]=2;
			}else{
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=3><font color=\"#7777ff\">「仕事」に含む</font></label>";
			}
		}
	}

	if(n==0){
		target.innerHTML +="「愛」「交友」「仕事」のいずれかに該当しそうな文が一つも見つかりませんでした。<br>";
	}else if(c==0){
		target.innerHTML +="「愛」「交友」「仕事」のいずれか複数に該当しそうな文が一つも見つかりませんでした。<br>";
	}//DOMを操作してみよう「愛」「交友」「仕事」のいずれかに該当しそうな単語が一つも見つかりませんでした。

	//console.log("checked");
	//console.log(checked);
	chboxlength=c;

	//console.log("keitaisokaiseki");
	//console.log(keitaisokaiseki.length);
	n=0;

	for(m=0;m<keitaisokaiseki.length;m=m+2){


		n++;

		chboxlist2[n]=[];
		chboxlist2[n][0]=hatsugen[m];
		chboxlist2[n][1]=4;

		c++;
		taiou[c-1]=n-1;

		if(RGBlist[m/2][3]==1){
			//console.log("「%s」は開かれた質問だと思います",hatsugen[m]);
			//checked2[n-1]=3;
			target.innerHTML += "<div id=\"b" + c + "\"><font size=1 color=gray>"+ (m+1) + " "  + hatsugen[m] + "</font></div><div id=\"r" + c + "\" class=\"hide\"><label><input type=radio name=\"r" + c + "\" value=3 checked><font color=red>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=dimgray>相づち</font></label><label><input type=radio name=\"r"
			 + c + "\" value=6><font color=orange>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=silver>世間話</font></label></div><br>";
		}else	if(RGBlist[m/2][5]==1){
			//console.log("「%s」は相づちだと思います",hatsugen[m]);
			//checked2[n-1]=5;
			target.innerHTML += "<div id=\"b" + c + "\"><font size=1 color=gray>"+ (m+1) + " "  + hatsugen[m] + "</font></div><div id=\"r" + c + "\" class=\"hide\"><label><input type=radio name=\"r" + c + "\" value=3><font color=red>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5 checked><font color=dimgray>相づち</font></label><label><input type=radio name=\"r"
			 + c + "\" value=6><font color=orange>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=silver>世間話</font></label></div><br>";
		}else	if(RGBlist[m/2][4]==1){
			//console.log("「%s」は閉じられた質問だと思います",hatsugen[m]);
			//checked2[n-1]=4;
			target.innerHTML += "<div id=\"b" + c + "\"><font size=1 color=gray>"+ (m+1) + " "  + hatsugen[m] + "</font></div><div id=\"r" + c + "\" class=\"hide\"><label><input type=radio name=\"r" + c + "\" value=3><font color=red>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4 checked><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=dimgray>相づち</font></label><label><input type=radio name=\"r"
			 + c + "\" value=6><font color=orange>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=silver>世間話</font></label></div><br>";
		}else	if(RGBlist[m/2][6]==1){
			//console.log("「%s」は解釈だと思います",hatsugen[m]);
			target.innerHTML += "<div id=\"b" + c + "\">"+ (m+1) + " "  + hatsugen[m] + "</div><div id=\"r" + c + "\"><label><input type=radio name=\"r" + c + "\" value=3><font color=red>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=dimgray>相づち</font></label><label><input type=radio name=\"r" + c
			+ "\" value=6 checked><font color=orange>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=silver>世間話</font></label></div><br>";

		}else{
			//console.log("「%s」は無駄話だと思います",hatsugen[m]);
			target.innerHTML += "<div id=\"b" + c + "\">"+ (m+1) + " "  + hatsugen[m] + "</div><div id=\"r" + c + "\"><label><input type=radio name=\"r" + c + "\" value=3><font color=red>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=dimgray>相づち</font></label><label><input type=radio name=\"r" + c
			+ "\" value=6><font color=orange>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7 checked><font color=silver>世間話</font></label></div><br>";

		}
	}//m=0;m<keitaisokaiseki.length;m=m+2

	if(c==chboxlength){
		target.innerHTML +="「解釈」「無駄話」のいずれかに該当しそうなカウンセラーの発言が一つも見つかりませんでした。";
	}

	//console.log("checked2");
	//console.log(checked2);
	chboxlength2 = c -chboxlength;
	//console.log("chboxlength2=%d",chboxlength2);

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
