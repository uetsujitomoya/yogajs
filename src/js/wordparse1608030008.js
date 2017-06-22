import "kuromoji";
import $ from 'jquery';
import {select} from "../select.js";
import {setForViz} from "../svg.js";
import slider from "bootstrap-slider";


let readJson = (originalText,event,jsonName) => {
    let signal = "blue";

    switch (signal) {
        case "red":
            readJsonAutomatically(jsonName,originalText);
            break;
		/*
		 case "green":
		 case "blue":
		 console.log("go!");
		 break;
		 case "yellow":
		 console.log("slow down!");
		 break;*/
        default:
            readJsonManually(originalText,event);
            break;
    }

};

let readJsonAutomatically=(jsonName,originalText)=>{
    $.getJSON("./json/"+jsonName+".json" , function(data) {
        originalText=data[0].a;
    });
};

let readJsonManually=(originalText,event)=>{
	console.log(event);
    originalText = JSON.parse(event.target.result);
};


var makeOnClick = (c) =>{
	document.getElementById("b"+c).onclick = () => {
		const id = "r"+c;
		document.getElementById(id).classList.toggle("hide");
	};
};
var makeOnClickS = (c) =>{
	document.getElementById("bs"+c).onclick = () => {
		const id = "rs"+c;
		document.getElementById(id).classList.toggle("hide");
	};
};

let selectGraphShape = function(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,vResult) {
    console.log("%centerred selectGraphShape",'color:red');

    document.getElementById('GraphSelectButton').onclick = () => {
		 console.log("GraphSelectButton_onchange");
		 getVizResult(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,vResult)

    };//graphの形状を切り替えた際もここで再描画される
};

var ClassifyWithFirstWordDictionary = (name,keitaisokaiseki,checkboxlist,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,originalText) => {

	let jsonName = "160803dummy";
	var startTime = new Date();
	console.log(startTime);


	var h,i,j,k,m,n,c,x,y,z;
	var hinshi = [];
	var RGB = [];
	let ranshin = [];
	var tangoset = new Set();
	var tangosett = [];
	var miserables={"nodes":[],"links":[]};

	checkboxlist=[];
	bun=[];

	//var data = JSON.parse(event.target.result);
	/*
	$.getJSON("./json/"+jsonName+".json" , function(data) {
    	orijinalText=data[0].a;
	});
	*/

	//readJson(originalText,event,jsonName);

    console.log("%c enter kuromoji 91",'color:red');
	return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {

        let visResult;
        console.log("%c entered kuromoji 95",'color:red');
        console.log(originalText);
        const path = tokenizer.tokenize(originalText);
		n=0;
		var tangosuu=0;
		m=0;
		var kanjamoji=0;
		var kanjatango=0;
		var kanjabun=0;
		var serapimoji=0;
		var serapitango=0;
		var serapibun=0;
		var soudesuka=0;
		while(n<path.length){
			keitaisokaiseki[m] = [];
			bun[m] = [];
			hatsugen[m] = "";
			hinshi[m] = [];
			RGB[m] = [];
			ranshin[m] = [];
			if(m%2==0){
				RGBlist[m/2] = [0,0,0,0,0,0,0,0];
			}
			i=0;
			tangosuu=0;
			while(n<path.length){
				keitaisokaiseki[m][i] = [];
				bun[m][i]="";
				hinshi[m][i]=[];
				keitaisokaiseki[m][i].length = 0;
				RGB[m][i] = [0,0,0];
				ranshin[m][i]=[0,0,0,0,0,0,0,0,0];
				j=0;
				while(n<path.length){
					tangosuu++;

					if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].word_id=="2613630"||path[n].surface_form=="･･･？："||path[n].surface_form==")："
					||path[n].surface_form=="…"||path[n].surface_form=="……"||path[n].surface_form=="・・・"||path[n].surface_form=="･･･"||path[n].surface_form.indexOf('〈') != -1||path[n].surface_form.indexOf('〉') != -1){
						break;
					}
					if(m%2==1){
						kanjatango++;
						kanjamoji=kanjamoji+path[n].surface_form.length;
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

						if(path[n].basic_form=="病"||path[n].basic_form=="病気"||path[n].basic_form=="ストレス"||path[n].basic_form=="不調"||path[n].basic_form=="過食"||path[n].basic_form=="嘔吐"||path[n].basic_form=="過食嘔吐"){
							ranshin[m][i][0]=1;
						}
						if(path[n].basic_form=="無気力"||path[n].basic_form=="気力"||path[n].basic_form=="やる気"){
							ranshin[m][i][1]=1;
						}
						if(path[n].basic_form=="疑い"||path[n].basic_form=="疑う"||path[n].basic_form=="疑心暗鬼"||path[n].basic_form=="疑心"){
							ranshin[m][i][2]=1;
						}
						if(path[n].basic_form=="注意"||path[n].basic_form=="不注意"||path[n].basic_form=="注意散漫"||path[n].basic_form=="無自覚"||path[n].basic_form=="自覚"){
							ranshin[m][i][3]=1;
						}
						if(path[n].basic_form=="引き延ばし"||path[n].basic_form=="引き延ばす"||path[n].basic_form=="怠慢"||path[n].basic_form=="怠惰"){
							ranshin[m][i][4]=1;
						}
						if(path[n].basic_form=="渇望"||path[n].basic_form=="切望"||path[n].basic_form=="欲しい"){
							ranshin[m][i][5]=1;
						}
						if(path[n].basic_form=="妄想"||path[n].basic_form=="空想"||path[n].basic_form=="想い"||path[n].basic_form=="ふける"){
							ranshin[m][i][6]=1;
						}
						if(path[n].basic_form=="抜け出す"||path[n].basic_form=="打破"||path[n].basic_form=="勝つ"||path[n].basic_form=="戦う"){
							ranshin[m][i][7]=1;
						}
						if(path[n].basic_form=="不安定"||path[n].basic_form=="安定"||path[n].basic_form=="落ち着く"){
							ranshin[m][i][8]=1;
						}
					}else if(m%2==0){
						serapitango++;
						serapimoji=serapimoji+path[n].surface_form.length;
						if(path[n].surface_form=="そう"&&path[n+1].surface_form=="です"&&path[n+2].surface_form=="か"){
							soudesuka++;
						}
						if(path[n].surface_form=="何"&&path[n+1].surface_form=="か"){

						}else if(path[n].basic_form=="いかが"||path[n].basic_form=="なんで"||path[n].basic_form=="どうして"||path[n].basic_form=="どの"||path[n].basic_form=="どのように"||path[n].basic_form=="いつ"||path[n].basic_form=="どういう"||path[n].basic_form=="どなた"||path[n].basic_form=="どう"||path[n].surface_form=="何"||path[n].basic_form=="誰"||path[n].basic_form=="どんな"||path[n].basic_form=="どのような"||path[n].basic_form=="どこ"){
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
				if(m%2==1){
					kanjabun++;
				}else{
					serapibun++;
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
				if(path[n].word_id=="2613630"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].surface_form=="･･･？："||path[n].surface_form==")："||path[n].surface_form.indexOf('〈') != -1||path[n].surface_form.indexOf('〉') != -1){
					if(m%2==0 ){
						if( i<=2 && tangosuu<=7){
							RGBlist[m/2][5]=1;
						}
					}
					n++;
					break;
				}
				n++;
				i++;
			}
			m++;
		}
		//console.log("%d 来談者文 %d 単語 %d 文字 %d 治療者文 %d 単語 %d 文字 %d",m,kanjabun,kanjatango,kanjamoji,serapibun,serapitango,serapimoji);
		//console.log("そうですか %d",soudesuka);
		//var uetsuji="うえつじともや";
		//console.log(uetsuji.length);

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

		var storage = localStorage;//初回読み込み

		var graph;

		var sResult = select(name,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

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
		//graph = sResult.graph;
		//console.log("chboxlength2=%d",chboxlength2)

		getVizResult(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult);

		//以下は後ろじゃなきゃアカン
		for(c=1;c<=chboxlength;c++){
			makeOnClick(c);
		}
		for(c=1;c<=chboxlength2;c++){
			makeOnClickS(c);
		}

        selectGraphShape(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult);

        

		document.getElementById('radio_buttons').onchange = () => {
			setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);
		};//graphの形状を切り替えた際もここで再描画される

		//graphのラジオボタン変わったらまた描画
		document.getElementById('zoom').addEventListener('click',function(){getVizResult(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult);});
		
	    //スライダー
		$("#slider1").slider();
		$("#slider1").on("slide", function(slideEvt) {
		    $("#SliderVal").text(slideEvt.value);
		    getVizResult(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult);
		});



		return{
			name:name,RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2
		};
	});
};


let getVizResult=(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult)=>{
   
    let zoom_value = document.getElementById("zoom_value").value;
    console.log(zoom_value);

    visResult = setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);//形態素解析後に1度目の描画
    chboxlist = visResult.chboxlist;
    chboxlist2 = visResult.chboxlist2;
    RGBlist = visResult.RGBlist;
    checked = visResult.checked;
    checked2 = visResult.checked2;
    chboxlength = visResult.chboxlength;
    chboxlength2 = visResult.chboxlength2;
    chboxlength2 = visResult.ranshin;
};


export {ClassifyWithFirstWordDictionary};
