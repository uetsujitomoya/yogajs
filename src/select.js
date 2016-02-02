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
				target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\">"+ bun[m][i] + "</div><div id=\"r" + c + "\"><font size=1>（" + (m+1) + " " + hatsugen[m] + "）</font><br><label><input type=radio name=\"r" + c + "\" value=0>どれにも含まない</label></div><br>";

			}else{
				target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\"><font size=1>"+ bun[m][i] + "</div><div id=\"r" + c + "\" class=\"hide\"><font size=1>（" + (m+1) + " " + hatsugen[m] + "）</font><br><label><input type=radio name=\"r" + c + "\" value=0>どれにも含まない</label></div></font><br>";
			}

			if(RGB[m][i][0]==1){
				chboxlist[n][1]=0;
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=1 checked><font color=\"#ff7777\">【</font>「愛」に含む<font color=\"#ff7777\">】</font></label>";
			}else{
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=1><font color=\"#ff7777\">【</font>「愛」に含む<font color=\"#ff7777\">】</font></label>";
			}
			if(RGB[m][i][1]==1){
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=2 checked><font color=\"#77ff77\">【</font>「交友」に含む<font color=\"#77ff77\">】</font></label>";
				chboxlist[n][1]=1;
			}else{
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=2><font color=\"#77ff77\">【</font>「交友」に含む<font color=\"#77ff77\">】</font></label>";
			}
			if(RGB[m][i][2]==1){
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=3 checked><font color=\"#7777ff\">【</font>「仕事」に含む<font color=\"#7777ff\">】</font></label>";
				chboxlist[n][1]=2;
			}else{
				document.getElementById("r"+c).innerHTML += "<label><input type=radio name=\"r" + c + "\" value=3><font color=\"#7777ff\">【</font>「仕事」に含む<font color=\"#7777ff\">】</font></label>";
			}
		}
	}

	/*if(n==0){
		target.innerHTML +="「愛」「交友」「仕事」のいずれかに該当しそうな文が一つも見つかりませんでした。<br>";
	}else if(c==0){
		target.innerHTML +="「愛」「交友」「仕事」のいずれか複数に該当しそうな文が一つも見つかりませんでした。<br>";
	}*/
	chboxlength=c;
	n=0;
	for(m=0;m<keitaisokaiseki.length;m=m+2){
		n++;
		chboxlist2[n]=[];
		chboxlist2[n][0]=hatsugen[m];
		chboxlist2[n][1]=4;
		c++;
		taiou[c-1]=n-1;
		if(RGBlist[m/2][3]==1){
			target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\"><font size=1 color=dimgray>"+ (m+1) + " "  + hatsugen[m] + "</font></div><div id=\"r" + c + "\" class=\"hide\"><label><input type=radio name=\"r" + c + "\" value=3 checked><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r"
			 + c + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=black>世間話</font></label></div><br>";
		}else	if(RGBlist[m/2][5]==1){
			target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\"><font size=1 color=dimgray>"+ (m+1) + " "  + hatsugen[m] + "</font></div><div id=\"r" + c + "\" class=\"hide\"><label><input type=radio name=\"r" + c + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5 checked><font color=purple>相づち</font></label><label><input type=radio name=\"r"
			 + c + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=black>世間話</font></label></div><br>";
		}else	if(RGBlist[m/2][4]==1){
			target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\"><font size=1 color=dimgray>"+ (m+1) + " "  + hatsugen[m] + "</font></div><div id=\"r" + c + "\" class=\"hide\"><label><input type=radio name=\"r" + c + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4 checked><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r"
			 + c + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=black>世間話</font></label></div><br>";
		}else	if(RGBlist[m/2][6]==1){
			target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\">"+ (m+1) + " "  + hatsugen[m] + "</div><div id=\"r" + c + "\"><label><input type=radio name=\"r" + c + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r" + c
			+ "\" value=6 checked><font color=orangered>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7><font color=black>世間話</font></label></div><br>";
		}else{
			target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\">"+ (m+1) + " "  + hatsugen[m] + "</div><div id=\"r" + c + "\"><label><input type=radio name=\"r" + c + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"r" + c + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"r" + c + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r" + c
			+ "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"r" + c + "\" value=7 checked><font color=black>世間話</font></label></div><br>";
		}
	}
	/*if(c==chboxlength){
		target.innerHTML +="「解釈」「無駄話」のいずれかに該当しそうなカウンセラーの発言が一つも見つかりませんでした。";
	}*/
	chboxlength2 = c -chboxlength;
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
export {select};
