import "kuromoji";
import {select} from "./select.js"
import {setForViz} from "./svg.js"
var makeOnClick = (c) =>{
	document.getElementById("b"+c).onclick = (e) => {
		const id = "r"+c;
		document.getElementById(id).classList.toggle("hide");
	};
}
var makeOnClickS = (c) =>{
	document.getElementById("bs"+c).onclick = (e) => {
		const id = "rs"+c;
		document.getElementById(id).classList.toggle("hide");
	};
}
var funcReaderOnload = (event,keitaisokaiseki,checkboxlist,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) => {
	var h,i,j,k,l,m,n,c,r,g,b,x,y,z,bunsuu;
	var hinshi = [];
	var RGB = [];
	var tangoset = new Set();
	var tangosett = [];
	var miserables={"nodes":[],"links":[]};
	var list = [];
	var target = document.getElementById("chbox");
	var checkboxlist=[];
	bun=[];
	var data = JSON.parse(event.target.result);
	return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
		const path = tokenizer.tokenize(data[0].a);
		n=0;
		var tangosuu=0;
		m=0;
		while(n<path.length){
			keitaisokaiseki[m] = [];
			bun[m] = [];
			hatsugen[m] = "";
			hinshi[m] = [];
			RGB[m] = [];
			if(m%2==0){
				RGBlist[m/2] = [0,0,0,0,0,0,0];
			}
			i=0;
			tangosuu=0;
			while(n<path.length){
				keitaisokaiseki[m][i] = [];
				bun[m][i]="";
				hinshi[m][i]=[];
				keitaisokaiseki[m][i].length = 0;
				RGB[m][i] = [0,0,0];
				j=0;
				while(n<path.length){
					tangosuu++;
					if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].word_id=="2613630"||path[n].surface_form=="･･･？："||path[n].surface_form==")："
					||path[n].surface_form=="…"||path[n].surface_form=="……"||path[n].surface_form=="・・・"||path[n].surface_form=="･･･"){
						break;
					}
					if(m%2==1){
						if(path[n].basic_form=="母"||path[n].basic_form=="主人"||path[n].basic_form=="父さん"||path[n].basic_form=="ご主人"||path[n].basic_form=="お父さん"||path[n].basic_form=="姉"||path[n].basic_form=="姉さん"||path[n].basic_form=="母親"
						||path[n].basic_form=="お姉さん"||path[n].basic_form=="父"||path[n].basic_form=="家族"){
							RGB[m][i][0]=1;
						}
						if(path[n].basic_form=="兄"||path[n].basic_form=="子"||path[n].basic_form=="子ども"||path[n].basic_form=="妹"||path[n].basic_form=="弟"){
							RGB[m][i][0]=1;
						}
						if(path[n].basic_form=="両親"||path[n].basic_form=="お母様"||path[n].basic_form=="お父様"){
							RGB[m][i][0]=1;
						}
						if(path[n].basic_form=="仕事"||path[n].basic_form=="休み"||path[n].basic_form=="アルバイト"||path[n].basic_form=="働く"||path[n].basic_form=="同僚"||path[n].basic_form=="職場"||path[n].basic_form=="上司"||path[n].basic_form=="部下"){
							RGB[m][i][2]=1;
						}
						if(path[n].basic_form=="友人"||path[n].basic_form=="親友"||path[n].basic_form=="友達"||path[n].basic_form=="友"||path[n].basic_form=="交友"||path[n].basic_form=="友好"){
							RGB[m][i][1]=1;
						}
					}else if(m%2==0){
						if(path[n].basic_form=="いかが"||path[n].basic_form=="なんで"||path[n].basic_form=="どうして"||path[n].basic_form=="どの"||path[n].basic_form=="どのように"||path[n].basic_form=="いつ"||path[n].basic_form=="どういう"||path[n].basic_form=="どなた"||path[n].basic_form=="どう"||path[n].basic_form=="何"||path[n].basic_form=="何か"||path[n].basic_form=="どんな"||path[n].basic_form=="どのような"){
							RGBlist[m/2][3]=1;
						}else if(path[n].surface_form=="か"&&path[n].pos=="助詞"){
							RGBlist[m/2][4]=1;
						}else if(path[n].surface_form=="ね"&&path[n].pos=="助詞"){
							RGBlist[m/2][6]=1;
						}
					}
					bun[m][i] += path[n].surface_form;
					if(path[n].pos_detail_1=="接尾"||path[n].basic_form=="*"||path[n].pos=="助詞"||path[n].basic_form=="、"||path[n].pos=="記号"||path[n].pos=="助動詞"||path[n].pos=="感動詞"||path[n].pos=="接頭詞"||path[n].pos_detail_1=="非自立"
					||path[n].basic_form=="する"||path[n].basic_form=="いる"||path[n].basic_form=="こういう"||path[n].basic_form=="そういう"||path[n].basic_form=="こう"||path[n].basic_form=="する"||path[n].basic_form=="こうした"||path[n].basic_form=="いう"||path[n].basic_form=="する"
					||path[n].basic_form=="なる"||path[n].basic_form=="その"||path[n].basic_form=="あの"||path[n].pos_detail_1=="数"||path[n].basic_form=="そう"||path[n].basic_form=="気持ち"||path[n].basic_form=="思い"||path[n].basic_form=="思う"||path[n].basic_form=="ある"){
						n++;
						continue;
					}
					keitaisokaiseki[m][i][j] = path[n].basic_form;
					n++;
					j++;
				}
				if(bun[m][i]=="Ａ"||bun[m][i]=="Ｂ"||bun[m][i]=="Ｔ"||bun[m][i]=="A"||bun[m][i]=="B"||bun[m][i]=="T"){
					bun[m][i]="";
					continue;
				}
				if(bun[m][i]!="Ａ"&&bun[m][i]!="Ｂ"&&bun[m][i]!="Ｔ"&&bun[m][i]!="A"&&bun[m][i]!="B"&&bun[m][i]!="T"&&bun[m][i]!=""){
					hatsugen[m] += bun[m][i];
					hatsugen[m] += "。";
				}
				if(n==path.length){
					if(m%2==0 ){
						if( i<=2 && tangosuu<=7){
							RGBlist[m/2][5]=1;
						}
					}
					break;
				}
				if(path[n].word_id=="2613630"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].surface_form=="･･･？："||path[n].surface_form==")："){
					if(m%2==0 ){
						if( i<=2 && tangosuu<=7){
							RGBlist[m/2][5]=1;
						}
					}
					n++;
					break;
				}
				bunsuu=0;
				n++;
				i++;
			}
			m++;
		}
		var tango=[];
		x=0;
		for(m=0;m<keitaisokaiseki.length;++m){
			for(i=0;i<keitaisokaiseki[m].length;++i){
				for(j=0;j<keitaisokaiseki[m][i].length;++j){
					tango[x]=keitaisokaiseki[m][i][j];
					x++;
				}
			}
		}
		x=0;
		for(m=0;m<keitaisokaiseki.length;++m){
			for(i=0;i<keitaisokaiseki[m].length;++i){
				for(j=0;j<keitaisokaiseki[m][i].length;++j){
					y=0;
					if(x>0){
						for(z=0;z<x;z++){
							if(tango[z]==keitaisokaiseki[m][i][j]){
								y=1;
								break;
							}
						}
					}
					x++;
					if(y==1){
						continue;//次のjへ
					}
					tangoset.add(keitaisokaiseki[m][i][j]);//tangoset終了
				}
			}
		}
		tangosett = Array.from(tangoset).map(function(t) {return {t};});

		for(i=0;i<tangosett.length;i++){
			miserables.nodes[i]=tangosett[i].t;
		}
		var RGBk=[];
		for(h=0;h<=2;h++){
			RGBk[h]=[];
			for(k=0;k<miserables.nodes.length;k++){
				RGBk[h][k]=0;
				for(m=1;m<keitaisokaiseki.length;m=m+2){
					for(i=0;i<keitaisokaiseki[m].length;i++){
						if(RGB[m][i][h]==1){
							for(j=0;j<keitaisokaiseki[m][i].length;j++){
								if(miserables.nodes[k]==keitaisokaiseki[m][i][j]){
									RGBk[h][k]=1;
									break;
								}
							}
						}
						if(RGBk[h][k]==1){
							break;
						}
					}
					if(RGBk[h][k]==1){
						break;
					}
				}
			}
		}

		for(h=0;h<=2;h++){
			for(k=0;k<miserables.nodes.length;k++){
				if(RGBk[h][k]==1){
					for(m=1;m<keitaisokaiseki.length;m=m+2){
						for(i=0;i<keitaisokaiseki[m].length;i++){
							if(RGB[m][i][h]==0){
								for(j=0;j<keitaisokaiseki[m][i].length;j++){
									if(miserables.nodes[k]==keitaisokaiseki[m][i][j]){
										RGB[m][i][h]=1;
										break;
									}
								}
							}
						}
					}
				}
			}
		}


		var sResult = select(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

		checkboxlist = sResult.checkboxlist;
		chboxlist = sResult.chboxlist;
		chboxlist2 = sResult.chboxlist2;
		RGB = sResult.RGB;
		RGBlist = sResult.RGBlist;
		checked = sResult.checked;
		checked2 = sResult.checked2;
		taiou = sResult.taiou;
		taiou2 = sResult.taiou2;

		chboxlength = sResult.chboxlength;
		chboxlength2 = sResult.chboxlength2;
		console.log("chboxlength=%d",chboxlength);
		for(c=1;c<=chboxlength;c++){
			makeOnClick(c);
		}
		console.log("chboxlength2=%d",chboxlength2);
		for(c=1;c<=chboxlength2;c++){
			makeOnClickS(c);
		}
		var vResult = setForViz(keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2);//形態素解析後に1度目の描画
		chboxlist = vResult.chboxlist;
		chboxlist2 = vResult.chboxlist2;
		RGBlist = vResult.RGBlist;
		checked = vResult.checked;
		checked2 = vResult.checked2;
		chboxlength = vResult.chboxlength;
		chboxlength2 = vResult.chboxlength2;



		document.getElementById('radio_buttons').onchange = () => {
			setForViz(keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);
		};

		return{
			RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2
		}
	})
};

export {funcReaderOnload};
