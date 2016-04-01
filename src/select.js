var select =(name,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) => {
	console.log(name+1+2+3);
	var h,i,j,k,l,m,n,f;
	taiou = [];
	taiou2=[];

	var target = document.getElementById("radio_buttons");//checkboxを出す場所

	var c=0;
	n=0;
	var btn=[];
	chboxlength=0;
	chboxlength2=0;
	var s=0;
	for(m=0;m<keitaisokaiseki.length;m++){
		if(m%2==1){
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
				chboxlength++;

				var sf =storage.getItem(name+"RGB"+m+i);

				if(sf!=null){
					RGB[m][i][sf]=1;
					for(f=0;f<=2;f++){
						if(f!=sf){
							RGB[m][i][f]=0;
						}
					}
				}

				taiou[c-1]=n-1;
				if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=2){
					target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\"><u>" + (m+1) + "(C) " + bun[m][i] + "</u></div><div id=\"r" + c + "\"><label><input type=radio name=\"r" + c + "\" value=0>どれにも含まない</label></div><br>";

				}else{
					target.innerHTML += "<div id=\"b" + c + "\" style=\"cursor: pointer\"><font size=2><u>" + (m+1) + "(C) " + bun[m][i] + "</u></div><div id=\"r" + c + "\" class=\"hide\"<label><input type=radio name=\"r" + c + "\" value=0>どれにも含まない</label></div></font><br>";
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
		}else{//セラピストの質問
			s++;
			chboxlength2++;
			chboxlist2[s]=[];
			chboxlist2[s][0]=hatsugen[m];
			chboxlist2[s][1]=4;
			taiou2[s-1]=s-1;

			var tf =storage.getItem(name+"RGBlist"+m);

			if(tf!=null){
				RGBlist[m/2][tf]=1;
				for(f=3;f<=6;f++){
					if(f!=tf){
						RGBlist[m/2][tf]=0;
					}
				}
			}

			if(RGBlist[m/2][3]==1){
				target.innerHTML += "<div id=\"bs" + s + "\" style=\"cursor: pointer\"><font size=2 color=dimgray><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></font></div><div id=\"rs" + s + "\" class=\"hide\"><label><input type=radio name=\"rs" + s + "\" value=3 checked><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r"
				+ s + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + s + "\" value=7><font color=black>世間話</font></label></div><br>";
			}else	if(RGBlist[m/2][5]==1){
				target.innerHTML += "<div id=\"bs" + s + "\" style=\"cursor: pointer\"><font size=2 color=dimgray><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></font></div><div id=\"rs" + s + "\" class=\"hide\"><label><input type=radio name=\"rs" + s + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=5 checked><font color=purple>相づち</font></label><label><input type=radio name=\"r"
				+ s + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + s + "\" value=7><font color=black>世間話</font></label></div><br>";
			}else	if(RGBlist[m/2][4]==1){
				target.innerHTML += "<div id=\"bs" + s + "\" style=\"cursor: pointer\"><font size=2 color=dimgray><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></font></div><div id=\"rs" + s + "\" class=\"hide\"><label><input type=radio name=\"rs" + s + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=4 checked><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r"
				+ s + "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + s + "\" value=7><font color=black>世間話</font></label></div><br>";
			}else	if(RGBlist[m/2][6]==1){
				target.innerHTML += "<div id=\"bs" + s + "\" style=\"cursor: pointer\"><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></div><div id=\"rs" + s + "\"><label><input type=radio name=\"rs" + s + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r" + c
				+ "\" value=6 checked><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + s + "\" value=7><font color=black>世間話</font></label></div><br>";
			}else{
				target.innerHTML += "<div id=\"bs" + s + "\" style=\"cursor: pointer\"><u>"+ (m+1) + "(T) "  + hatsugen[m] + "</u></div><div id=\"rs" + s + "\"><label><input type=radio name=\"rs" + s + "\" value=3><font color=deeppink>開かれた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=4><font color=blue>閉じられた質問</font></label><label><input type=radio name=\"rs" + s + "\" value=5><font color=purple>相づち</font></label><label><input type=radio name=\"r" + c
				+ "\" value=6><font color=orangered>解釈</font></label><label><input type=radio name=\"rs" + s + "\" value=7 checked><font color=black>世間話</font></label></div><br>";
			}
		}
	}

	console.log("chboxlength2 in select.js=%d",chboxlength2);
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
		chboxlength2:chboxlength2,
	};
}
export {select};
